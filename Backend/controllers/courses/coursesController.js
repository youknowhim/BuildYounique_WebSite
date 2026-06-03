const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createCourse = catchAsyncError(async (req, res, next) => {
  const { name, description, duration, course_type, price, discounted_price } =
    req.body;

  if (!name || !description || !duration || !course_type || price == null) {
    return next(
      new AppError(
        "name, description, duration, course_type and price are required",
        400,
      ),
    );
  }

  const result = await db(
    `INSERT INTO courses (name, description, duration, course_type, price, discounted_price) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      duration,
      course_type,
      price,
      discounted_price || price,
    ],
  );

  const [newCourse] = await db("SELECT * FROM courses WHERE id = ?", [
    result.insertId,
  ]);

  res.status(201).json({
    status: "success",
    data: {
      course: newCourse,
    },
  });
});

exports.getAllCourses = catchAsyncError(async (req, res) => {
  const courses = await db("SELECT * FROM courses ORDER BY id DESC");

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: {
      courses,
    },
  });
});

exports.getCourseById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const [course] = await db("SELECT * FROM courses WHERE id = ?", [id]);

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  res.status(200).json({ status: "success", data: { course } });
});

exports.updateCourseById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = [
    "name",
    "description",
    "duration",
    "course_type",
    "price",
    "discounted_price",
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
  const updateQuery = `UPDATE courses SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("Course not found", 404));
  }

  const [updatedCourse] = await db("SELECT * FROM courses WHERE id = ?", [id]);

  res.status(200).json({ status: "success", data: { course: updatedCourse } });
});

exports.deleteCourseById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM courses WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Course not found", 404));
  }

  res
    .status(200)
    .json({
      status: "success",
      message: "Course deleted successfully",
      data: null,
    });
});
