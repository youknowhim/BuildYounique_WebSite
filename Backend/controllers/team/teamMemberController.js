const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");
const { sendVerificationEmail } = require("../../utils/emailService");
const { generateOTP, getOTPExpiryTime } = require("../../utils/otpHelper");

const selectTeamMemberById = async (id) => {
  const [member] = await db("SELECT * FROM team_members WHERE id = ?", [id]);
  return member;
};

exports.createTeamMember = catchAsyncError(async (req, res, next) => {
  const { team_id, email } = req.body;

  if (!team_id || !email) {
    return next(new AppError("team_id and email are required", 400));
  }

  const [team] = await db(
    "SELECT id, leader_email_verified FROM teams WHERE id = ?",
    [team_id],
  );
  if (!team) {
    return next(new AppError("Team not found", 404));
  }

  if (!team.leader_email_verified) {
    return next(
      new AppError("Team leader email not verified. Cannot add members.", 400),
    );
  }

  const result = await db(
    "INSERT INTO team_members (team_id, email) VALUES (?, ?)",
    [team_id, email],
  );

  const memberId = result.insertId;
  const newMember = await selectTeamMemberById(memberId);

  // Generate OTP for member verification
  const otp = generateOTP();
  const expiryTime = getOTPExpiryTime();

  await db(
    "INSERT INTO email_otps (email, otp, purpose, reference_id, expires_at) VALUES (?, ?, ?, ?, ?)",
    [email, otp, "TEAM_MEMBER_VERIFICATION", memberId, expiryTime],
  );

  // Send verification email to member
  await sendVerificationEmail(
    email,
    "Team Member",
    otp,
    "TEAM_MEMBER_VERIFICATION",
  );

  res.status(201).json({
    status: "success",
    message: "Team member added. Verification email sent to member.",
    data: {
      team_member: newMember,
      verification_pending: true,
    },
  });
});

exports.verifyTeamMemberEmail = catchAsyncError(async (req, res, next) => {
  const { member_id, otp } = req.body;

  if (!member_id || !otp) {
    return next(new AppError("member_id and otp are required", 400));
  }

  const member = await selectTeamMemberById(member_id);
  if (!member) {
    return next(new AppError("Team member not found", 404));
  }

  const [otpRecord] = await db(
    "SELECT * FROM email_otps WHERE reference_id = ? AND purpose = 'TEAM_MEMBER_VERIFICATION' AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [member_id, otp],
  );

  if (!otpRecord) {
    return next(
      new AppError(
        "Invalid or expired OTP. Please request a new verification email.",
        400,
      ),
    );
  }

  // Mark member as verified
  await db("UPDATE team_members SET member_email_verified = 1 WHERE id = ?", [
    member_id,
  ]);

  // Remove used OTP
  await db(
    "DELETE FROM email_otps WHERE id = ? AND reference_id = ? AND purpose = 'TEAM_MEMBER_VERIFICATION'",
    [otpRecord.id, member_id],
  );

  const verifiedMember = await selectTeamMemberById(member_id);

  res.status(200).json({
    status: "success",
    message: "Member email verified successfully",
    data: {
      team_member: verifiedMember,
      verified: true,
    },
  });
});

exports.getAllTeamMembers = catchAsyncError(async (req, res) => {
  const { team_id } = req.query;

  let members;

  if (team_id) {
    members = await db(
      "SELECT * FROM team_members WHERE team_id = ? ORDER BY id DESC",
      [team_id],
    );
  } else {
    members = await db("SELECT * FROM team_members ORDER BY id DESC");
  }

  res.status(200).json({
    status: "success",
    results: members.length,
    data: {
      team_members: members,
    },
  });
});

exports.getTeamMemberById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const member = await selectTeamMemberById(id);

  if (!member) {
    return next(new AppError("Team member not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      team_member: member,
    },
  });
});

exports.updateTeamMemberById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { team_id, email } = req.body;

  const updates = [];
  const values = [];
  const allowedFields = ["team_id", "email"];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates.push(`${field} = ?`);
      values.push(req.body[field] || null);
    }
  });

  if (updates.length === 0) {
    return next(new AppError("Please provide fields to update", 400));
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "team_id")) {
    const [team] = await db("SELECT id FROM teams WHERE id = ?", [team_id]);
    if (!team) {
      return next(new AppError("Team not found", 404));
    }
  }

  const member = await selectTeamMemberById(id);
  if (!member) {
    return next(new AppError("Team member not found", 404));
  }

  values.push(id);
  const updateQuery = `UPDATE team_members SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("Team member not found", 404));
  }

  const updatedMember = await selectTeamMemberById(id);

  res.status(200).json({
    status: "success",
    data: {
      team_member: updatedMember,
    },
  });
});

exports.deleteTeamMemberById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const result = await db("DELETE FROM team_members WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Team member not found", 404));
  }
  const member = await selectTeamMemberById(id);

  res.status(200).json({
    status: "success",
    message: "Team member deleted successfully",
    data: null,
  });
});
