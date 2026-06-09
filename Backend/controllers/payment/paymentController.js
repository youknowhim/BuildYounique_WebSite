const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

const CASHFREE_SANDBOX_URL = "https://sandbox.cashfree.com";
const CASHFREE_PROD_URL = "https://api.cashfree.com";

const ensureFetchAvailable = () => {
  if (typeof fetch !== "function") {
    throw new AppError(
      "Fetch API is not available in this Node environment. Use Node 18+ or install a fetch polyfill.",
      500,
    );
  }
};

const getCashfreeBaseUrl = () =>
  process.env.CASHFREE_ENVIRONMENT === "PROD"
    ? CASHFREE_PROD_URL
    : CASHFREE_SANDBOX_URL;

const getCashfreeHeaders = () => {
  const clientId = process.env.CASHFREE_APP_ID;
  const clientSecret = process.env.CASHFREE_SECRET_KEY;

  if (!clientId || !clientSecret) {
    throw new AppError(
      "Cashfree API credentials are not configured in environment variables",
      500,
    );
  }

  return {
    "Content-Type": "application/json",
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
  };
};

const createCashfreeOrder = async (payload) => {
  ensureFetchAvailable();
  const baseUrl = getCashfreeBaseUrl();
  const response = await fetch(`${baseUrl}/pg/orders`, {
    method: "POST",
    headers: getCashfreeHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.order_id || !data.payment_link) {
    const errorMessage =
      data?.message || data?.reason || "Cashfree order creation failed";
    throw new AppError(`Cashfree error: ${errorMessage}`, 502);
  }

  return data;
};

const getCashfreeOrderStatus = async (orderId) => {
  ensureFetchAvailable();
  const baseUrl = getCashfreeBaseUrl();
  const response = await fetch(
    `${baseUrl}/pg/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      headers: getCashfreeHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.order_status) {
    const errorMessage =
      data?.message || data?.reason || "Unable to fetch Cashfree order status";
    throw new AppError(`Cashfree error: ${errorMessage}`, 502);
  }

  return data;
};

exports.createPayment = catchAsyncError(async (req, res, next) => {
  const { team_ids, promo_code } = req.body;

  if (!Array.isArray(team_ids) || team_ids.length === 0) {
    return next(
      new AppError("team_ids is required and must be a non-empty array", 400),
    );
  }

  const uniqueTeamIds = [...new Set(team_ids.map(Number))].filter(Boolean);

  const placeholders = uniqueTeamIds.map(() => "?").join(",");

  const teams = await db(
    `
    SELECT
      id,
      college_id,
      registration_fee_per_member,
      team_leader_name,
      team_leader_email,
      phone
    FROM teams
    WHERE id IN (${placeholders})
    `,
    uniqueTeamIds,
  );

  if (teams.length !== uniqueTeamIds.length) {
    return next(new AppError("One or more teams not found", 404));
  }

  const collegeIds = [...new Set(teams.map((team) => team.college_id))];

  if (collegeIds.length > 1) {
    return next(new AppError("All teams must belong to the same college", 400));
  }

  const collegeId = collegeIds[0];

  let totalAmount = 0;

  for (const team of teams) {
    const members = await db(
      `
      SELECT COUNT(*) AS total
      FROM team_members
      WHERE team_id = ?
      `,
      [team.id],
    );

    const memberCount = Number(members[0].total) + 1;

    totalAmount += memberCount * Number(team.registration_fee_per_member);
  }

  let promoCodeData = null;
  let discountAmount = 0;

  if (promo_code) {
    const promo = await db(
      `
      SELECT *
      FROM promo_codes
      WHERE promo_code = ?
      AND is_active = 1
      `,
      [promo_code],
    );

    if (!promo.length) {
      return next(new AppError("Invalid promo code", 400));
    }

    promoCodeData = promo[0];
    discountAmount = Number(promoCodeData.discount_amount || 0);
  }

  const finalAmount = Math.max(totalAmount - discountAmount, 0);

  const firstTeam = teams[0];

  if (
    !firstTeam.team_leader_name ||
    !firstTeam.team_leader_email ||
    !firstTeam.phone
  ) {
    return next(new AppError("Team leader details missing", 400));
  }

  const paymentResult = await db(
    `
    INSERT INTO payments
    (
      college_id,
      promo_code_id,
      total_amount,
      discount_amount,
      final_amount,
      payment_status
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      collegeId,
      promoCodeData ? promoCodeData.id : null,
      totalAmount,
      discountAmount,
      finalAmount,
      "pending",
    ],
  );

  const paymentId = paymentResult.insertId;

  const cashfreeOrderId = `PAY_${paymentId}_${Date.now()}`;

  await db(
    `
    INSERT INTO payment_teams
    (payment_id, team_id)
    VALUES
    ${uniqueTeamIds.map(() => "(?, ?)").join(",")}
    `,
    uniqueTeamIds.flatMap((teamId) => [paymentId, teamId]),
  );

  const orderPayload = {
    order_id: cashfreeOrderId,
    order_amount: Number(finalAmount.toFixed(2)),
    order_currency: "INR",

    customer_details: {
      customer_id: `PAY_${paymentId}`,
      customer_name: firstTeam.team_leader_name,
      customer_email: firstTeam.team_leader_email,
      customer_phone: firstTeam.phone,
    },

    order_meta: {
      notify_url: process.env.CASHFREE_WEBHOOK_URL,
    },
  };

  const cashfreeResponse = await createCashfreeOrder(orderPayload);

  await db(
    `
    UPDATE payments
    SET transaction_id = ?
    WHERE id = ?
    `,
    [cashfreeOrderId, paymentId],
  );

  res.status(201).json({
    status: "success",
    data: {
      payment: {
        id: paymentId,
        college_id: collegeId,
        team_ids: uniqueTeamIds,
        promo_code_id: promoCodeData?.id || null,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        payment_status: "pending",
        order_id: cashfreeOrderId,
        payment_session_id: cashfreeResponse.payment_session_id,
      },
    },
  });
});

exports.getPaymentById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const [payment] = await db("SELECT * FROM payments WHERE id = ?", [id]);

  if (!payment) {
    return next(new AppError("Payment not found", 404));
  }

  const teamRows = await db(
    "SELECT team_id FROM payment_teams WHERE payment_id = ?",
    [id],
  );

  res.status(200).json({
    status: "success",
    data: {
      payment: {
        ...payment,
        team_ids: teamRows.map((row) => row.team_id),
      },
    },
  });
});

exports.verifyPayment = catchAsyncError(async (req, res, next) => {
  const { payment_id } = req.body;

  if (!payment_id) {
    return next(new AppError("payment_id is required", 400));
  }

  const [payment] = await db("SELECT * FROM payments WHERE id = ?", [
    payment_id,
  ]);

  if (!payment) {
    return next(new AppError("Payment not found", 404));
  }

  if (!payment.transaction_id) {
    return next(new AppError("Cashfree order ID not found", 400));
  }

  const cashfreeStatus = await getCashfreeOrderStatus(payment.transaction_id);

  const rawStatus = String(
    cashfreeStatus.order_status || cashfreeStatus.status || "PENDING",
  ).toUpperCase();

  let paymentStatus = "pending";

  if (rawStatus === "PAID" || rawStatus === "SUCCESS") {
    paymentStatus = "paid";
  } else if (["FAILED", "CANCELLED", "EXPIRED"].includes(rawStatus)) {
    paymentStatus = "failed";
  }

  await db(
    `
    UPDATE payments
    SET payment_status = ?
    WHERE id = ?
    `,
    [paymentStatus, payment_id],
  );

  if (paymentStatus === "paid") {
    await db(
      `
      UPDATE teams t
      JOIN payment_teams pt
      ON t.id = pt.team_id
      SET t.payment_status = 'paid'
      WHERE pt.payment_id = ?
      `,
      [payment_id],
    );

    if (payment.promo_code_id) {
      await db(
        `
        UPDATE promo_codes
        SET used_count = used_count + 1
        WHERE id = ?
        `,
        [payment.promo_code_id],
      );
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      payment_id,
      payment_status: paymentStatus,
      cashfree_status: rawStatus,
    },
  });
});

exports.cashfreeWebhook = catchAsyncError(async (req, res) => {
  const payload = req.body;

  const orderId = payload?.data?.order?.order_id;

  if (!orderId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid payload",
    });
  }

  const [payment] = await db(
    `
    SELECT *
    FROM payments
    WHERE transaction_id=?
    `,
    [orderId],
  );

  if (!payment) {
    return res.status(404).json({
      status: "error",
      message: "Payment not found",
    });
  }

  const paymentStatus = payload?.data?.payment?.payment_status;

  if (paymentStatus === "SUCCESS" && payment.payment_status !== "paid") {
    await db(
      `
      UPDATE payments
      SET payment_status='paid'
      WHERE id=?
      `,
      [payment.id],
    );

    await markPaymentAsPaid(payment.id, payment.promo_code_id);
  }

  return res.status(200).json({
    status: "success",
  });
});
