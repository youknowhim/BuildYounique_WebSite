const jwt = require("jsonwebtoken");
const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");
const { sendVerificationEmail } = require("../../utils/emailService");
const { generateOTP, getOTPExpiryTime } = require("../../utils/otpHelper");

const selectTeamById = async (id) => {
  const [team] = await db("SELECT * FROM teams WHERE id = ?", [id]);
  return team;
};

exports.createTeam = catchAsyncError(async (req, res, next) => {
  const {
    college_id,
    hackathon_event_id,
    team_name,
    team_leader_name,
    team_leader_email,
    phone,
    registration_fee_per_member,
  } = req.body;

  if (!college_id || !team_name || !team_leader_email || !hackathon_event_id) {
    return next(
      new AppError(
        "college_id, team_name, hackathon_event_id, and team_leader_email are required",
        400,
      ),
    );
  }

  const [college] = await db("SELECT id FROM colleges WHERE id = ?", [
    college_id,
  ]);
  if (!college) {
    return next(new AppError("College not found", 404));
  }

  const result = await db(
    `INSERT INTO teams (college_id, hackathon_event_id, team_name, team_leader_name, team_leader_email, phone, registration_fee_per_member) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      college_id,
      hackathon_event_id,
      team_name,
      team_leader_name || null,
      team_leader_email,
      phone,
      registration_fee_per_member || 600,
    ],
  );

  const teamId = result.insertId;
  const newTeam = await selectTeamById(teamId);

  // Generate OTP for email verification
  const otp = generateOTP();
  const expiryTime = getOTPExpiryTime();

  // Store OTP in email_otps table
  await db(
    "INSERT INTO email_otps (email, otp, purpose, reference_id, expires_at) VALUES (?, ?, ?, ?, ?)",
    [team_leader_email, otp, "TEAM_LEADER_VERIFICATION", teamId, expiryTime],
  );

  // Send verification email
  await sendVerificationEmail(
    team_leader_email,
    team_leader_name || "Team Leader",
    otp,
    "TEAM_LEADER_VERIFICATION",
  );

  res.status(201).json({
    status: "success",
    message:
      "Team created successfully. Verification email sent to team leader.",
    data: {
      team: newTeam,
      verification_pending: true,
      message: "Please verify email using OTP sent to " + team_leader_email,
    },
  });
});

exports.getAllTeams = catchAsyncError(async (req, res, next) => {
  const { college_id } = req.query;
  let teams;

  if (college_id) {
    teams = await db(
      `SELECT * FROM teams WHERE college_id = ? ORDER BY id DESC`,
      [college_id],
    );
  } else {
    teams = await db(`SELECT * FROM teams ORDER BY id DESC`);
  }

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  });
});

exports.getTeamById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const team = await selectTeamById(id);

  if (!team) {
    return next(new AppError("Team not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

exports.updateTeamById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = [
    "college_id",
    "team_name",
    "team_leader_name",
    "team_leader_email",
    "registration_fee_per_member",
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

  if (Object.prototype.hasOwnProperty.call(req.body, "college_id")) {
    const [college] = await db("SELECT id FROM colleges WHERE id = ?", [
      req.body.college_id,
    ]);
    if (!college) {
      return next(new AppError("College not found", 404));
    }
  }

  values.push(id);
  const updateQuery = `UPDATE teams SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("Team not found", 404));
  }

  const updatedTeam = await selectTeamById(id);

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  });
});

exports.deleteTeamById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM teams WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Team not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Team deleted successfully",
    data: null,
  });
});

exports.loginTeam = catchAsyncError(async (req, res, next) => {
  const { team_leader_email } = req.body;

  if (!team_leader_email) {
    return next(new AppError("team_leader_email is required", 400));
  }

  const [team] = await db(
    "SELECT * FROM teams WHERE team_leader_email = ? ORDER BY id DESC LIMIT 1",
    [team_leader_email],
  );

  if (!team) {
    return next(new AppError("Team not found for this email", 404));
  }

  if (!team.leader_email_verified) {
    return next(
      new AppError(
        "Team leader email is not verified. Please verify registration email first.",
        400,
      ),
    );
  }

  const otp = generateOTP();
  const expiryTime = getOTPExpiryTime();

  await db(
    "INSERT INTO email_otps (email, otp, purpose, reference_id, expires_at) VALUES (?, ?, ?, ?, ?)",
    [team_leader_email, otp, "TEAM_LOGIN", team.id, expiryTime],
  );

  await sendVerificationEmail(
    team_leader_email,
    team.team_leader_name || "Team Leader",
    otp,
    "TEAM_LOGIN",
  );

  res.status(200).json({
    status: "success",
    message: "OTP sent to team leader email.",
    data: {
      team_id: team.id,
      login_pending: true,
    },
  });
});

exports.verifyTeamLogin = catchAsyncError(async (req, res, next) => {
  const { team_id, otp } = req.body;

  if (!team_id || !otp) {
    return next(new AppError("team_id and otp are required", 400));
  }

  const team = await selectTeamById(team_id);
  if (!team) {
    return next(new AppError("Team not found", 404));
  }

  const [otpRecord] = await db(
    "SELECT * FROM email_otps WHERE reference_id = ? AND purpose = 'TEAM_LOGIN' AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [team_id, otp],
  );

  if (!otpRecord) {
    return next(
      new AppError(
        "Invalid or expired OTP. Please request a new login code.",
        400,
      ),
    );
  }

  await db(
    "DELETE FROM email_otps WHERE id = ? AND reference_id = ? AND purpose = 'TEAM_LOGIN'",
    [otpRecord.id, team_id],
  );

  const token = jwt.sign(
    { team_id: team.id, team_leader_email: team.team_leader_email },
    process.env.JWT_SECRET || "default_team_secret",
    { expiresIn: "7d" },
  );

  res.status(200).json({
    status: "success",
    message: "Login verified successfully.",
    data: {
      team,
      token,
    },
  });
});

exports.verifyTeamLeaderEmail = catchAsyncError(async (req, res, next) => {
  const { team_id, otp } = req.body;

  if (!team_id || !otp) {
    return next(new AppError("team_id and otp are required", 400));
  }

  // Check if team exists
  const team = await selectTeamById(team_id);
  if (!team) {
    return next(new AppError("Team not found", 404));
  }

  // Verify OTP from email_otps table
  const [otpRecord] = await db(
    "SELECT * FROM email_otps WHERE reference_id = ? AND purpose = 'TEAM_LEADER_VERIFICATION' AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [team_id, otp],
  );

  if (!otpRecord) {
    return next(
      new AppError(
        "Invalid or expired OTP. Please request a new verification email.",
        400,
      ),
    );
  }

  // Update team to mark email as verified
  await db("UPDATE teams SET leader_email_verified = 1 WHERE id = ?", [
    team_id,
  ]);

  // Delete used OTP
  await db(
    "DELETE FROM email_otps WHERE id = ? AND reference_id = ? AND purpose = 'TEAM_LEADER_VERIFICATION'",
    [otpRecord.id, team_id],
  );

  const verifiedTeam = await selectTeamById(team_id);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
    data: {
      team: verifiedTeam,
      verified: true,
    },
  });
});

exports.teamProtect = catchAsyncError(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  console.log("Decoded Team Token:", decoded);

  // 3. Check if team exists
  const sql = `
    SELECT *
    FROM teams
    WHERE id = ?
  `;

  const result = await db(sql, [decoded.id]);
  const currentTeam = result;

  if (!currentTeam) {
    return next(
      new AppError("The team belonging to this token no longer exists.", 401),
    );
  }

  // 4. Attach team to request
  req.team = currentTeam;

  next();
});
