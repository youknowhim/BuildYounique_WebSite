const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createTraining = catchAsyncError(async (req, res, next) => {
  const {
    course_id,
    name,
    email,
    phone,
    college_name,
    year_of_study,
    address,
  } = req.body;

  if (
    !course_id ||
    !name ||
    !email ||
    !phone ||
    !college_name ||
    !year_of_study ||
    !address
  ) {
    return next(
      new AppError(
        "course_id, name, email, phone, college_name, year_of_study, and address are required",
        400,
      ),
    );
  }

  const [course] = await db("SELECT id FROM courses WHERE id = ?", [course_id]);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  const result = await db(
    `INSERT INTO training (course_id, name, email, phone, college_name, year_of_study, address) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [course_id, name, email, phone, college_name, year_of_study, address],
  );

  const [newTraining] = await db("SELECT * FROM training WHERE id = ?", [
    result.insertId,
  ]);

  res.status(201).json({
    status: "success",
    data: {
      training: newTraining,
    },
  });
});

exports.getAllTrainings = catchAsyncError(async (req, res) => {
  const trainings = await db("SELECT * FROM training ORDER BY id DESC");

  res.status(200).json({
    status: "success",
    results: trainings.length,
    data: {
      trainings,
    },
  });
});

exports.getTrainingById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const [training] = await db("SELECT * FROM training WHERE id = ?", [id]);

  if (!training) {
    return next(new AppError("Training registration not found", 404));
  }

  res.status(200).json({ status: "success", data: { training } });
});

exports.updateTrainingById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = [
    "course_id",
    "name",
    "email",
    "phone",
    "college_name",
    "year_of_study",
    "address",
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

  if (Object.prototype.hasOwnProperty.call(req.body, "course_id")) {
    const [course] = await db("SELECT id FROM courses WHERE id = ?", [
      req.body.course_id,
    ]);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }
  }

  values.push(id);
  const updateQuery = `UPDATE training SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("Training registration not found", 404));
  }

  const [updatedTraining] = await db("SELECT * FROM training WHERE id = ?", [
    id,
  ]);

  res
    .status(200)
    .json({ status: "success", data: { training: updatedTraining } });
});

exports.deleteTrainingById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM training WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Training registration not found", 404));
  }

  res
    .status(200)
    .json({
      status: "success",
      message: "Training registration deleted successfully",
      data: null,
    });
});
