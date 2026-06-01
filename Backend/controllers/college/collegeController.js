const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createCollege = catchAsyncError(async (req, res, next) => {
  const {
    college_name,
    contact_person,
    email,
    phone,
    total_registered_teams,
    total_registered_members,
  } = req.body;

  if (!college_name) {
    return next(new AppError("college_name is required", 400));
  }

  const result = await db(
    `INSERT INTO colleges (college_name, contact_person, email, phone, total_registered_teams, total_registered_members) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      college_name,
      contact_person || null,
      email || null,
      phone || null,
      total_registered_teams || 0,
      total_registered_members || 0,
    ],
  );

  const [newCollege] = await db("SELECT * FROM colleges WHERE id = ?", [
    result.insertId,
  ]);

  // Generate four promo codes (discounts: 100,200,300,400) tied to this college
  const generatePrefix = (name) => {
    if (!name) return "CLG";
    const words = name.trim().split(/\s+/);
    let prefix = words
      .slice(0, 4)
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase();
    if (prefix.length < 4) {
      prefix = name.replace(/\s+/g, "").slice(0, 4).toUpperCase();
    }
    return prefix || "CLG";
  };

  const randomString = (len = 4) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let s = "";
    for (let i = 0; i < len; i++)
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  };

  const prefix = generatePrefix(college_name);
  const amounts = [100, 200, 300, 400];
  for (const amt of amounts) {
    let inserted = false;
    let attempts = 0;
    while (!inserted && attempts < 5) {
      const code = `${prefix}${randomString(4)}${amt}`;
      try {
        await db(
          `INSERT INTO promo_codes (college_id, promo_code, discount_amount) VALUES (?, ?, ?)`,
          [result.insertId, code, amt],
        );
        inserted = true;
      } catch (err) {
        // If UNIQUE collision, retry with a new random string
        attempts += 1;
        if (attempts >= 5) {
          // give up on this promo code after a few tries
          break;
        }
      }
    }
  }

  const promoCodes = await db(
    "SELECT * FROM promo_codes WHERE college_id = ? ORDER BY id DESC LIMIT 4",
    [result.insertId],
  );

  res.status(201).json({
    status: "success",
    data: {
      college: newCollege,
      promo_codes: promoCodes,
    },
  });
});

exports.getAllColleges = catchAsyncError(async (req, res, next) => {
  const colleges = await db("SELECT * FROM colleges ORDER BY id DESC");

  res.status(200).json({
    status: "success",
    results: colleges.length,
    data: {
      colleges,
    },
  });
});

exports.getCollegeById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const [college] = await db("SELECT * FROM colleges WHERE id = ?", [id]);

  if (!college) {
    return next(new AppError("College not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      college,
    },
  });
});

exports.getPromoCodesByCollegeId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const [college] = await db("SELECT id FROM colleges WHERE id = ?", [id]);
  if (!college) {
    return next(new AppError("College not found", 404));
  }

  const promoCodes = await db(
    "SELECT id, promo_code, discount_amount, used_count, is_active, created_at FROM promo_codes WHERE college_id = ? ORDER BY id DESC",
    [id],
  );

  res.status(200).json({
    status: "success",
    results: promoCodes.length,
    data: {
      promo_codes: promoCodes,
    },
  });
});

exports.updateCollegeById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = [
    "college_name",
    "contact_person",
    "email",
    "phone",
    "total_registered_teams",
    "total_registered_members",
  ];

  const updates = [];
  const values = [];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  });

  if (updates.length === 0) {
    return next(new AppError("Please provide fields to update", 400));
  }

  values.push(id);
  const updateQuery = `UPDATE colleges SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("College not found", 404));
  }

  const [updatedCollege] = await db("SELECT * FROM colleges WHERE id = ?", [
    id,
  ]);

  res.status(200).json({
    status: "success",
    data: {
      college: updatedCollege,
    },
  });
});

exports.deleteCollegeById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM colleges WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("College not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "College deleted successfully",
    data: null,
  });
});
