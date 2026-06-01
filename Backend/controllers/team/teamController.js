const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

const selectTeamById = async (id) => {
  const [team] = await db("SELECT * FROM teams WHERE id = ?", [id]);
  return team;
};

exports.createTeam = catchAsyncError(async (req, res, next) => {
  const {
    college_id,
    team_name,
    team_leader_name,
    team_leader_email,
    registration_fee_per_member,
  } = req.body;

  if (!college_id || !team_name) {
    return next(new AppError("college_id and team_name are required", 400));
  }

  const [college] = await db("SELECT id FROM colleges WHERE id = ?", [
    college_id,
  ]);
  if (!college) {
    return next(new AppError("College not found", 404));
  }

  const result = await db(
    `INSERT INTO teams (college_id, team_name, team_leader_name, team_leader_email, registration_fee_per_member) VALUES (?, ?, ?, ?, ?)`,
    [
      college_id,
      team_name,
      team_leader_name || null,
      team_leader_email || null,
      registration_fee_per_member || 600,
    ],
  );

  const newTeam = await selectTeamById(result.insertId);

  res.status(201).json({
    status: "success",
    data: {
      team: newTeam,
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
