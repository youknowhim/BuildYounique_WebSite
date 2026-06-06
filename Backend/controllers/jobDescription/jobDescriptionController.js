const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

const VALID_EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
  "Freelance",
];
const VALID_STATUSES = ["Draft", "Active", "Closed"];

exports.createJobDescription = catchAsyncError(async (req, res, next) => {
  const {
    job_title,
    location,
    employment_type,
    experience_required,
    job_description,
    openings,
    status,
  } = req.body;

  if (!job_title || !job_description) {
    return next(
      new AppError("job_title and job_description are required", 400),
    );
  }

  const finalEmploymentType = employment_type || "Full-Time";
  if (!VALID_EMPLOYMENT_TYPES.includes(finalEmploymentType)) {
    return next(
      new AppError(
        `employment_type must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`,
        400,
      ),
    );
  }

  const finalStatus = status || "Active";
  if (!VALID_STATUSES.includes(finalStatus)) {
    return next(
      new AppError(`status must be one of: ${VALID_STATUSES.join(", ")}`, 400),
    );
  }

  const result = await db(
    `INSERT INTO job_descriptions (
        job_title,
        location,
        employment_type,
        experience_required,
        job_description,
        openings,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      job_title,
      location || null,
      finalEmploymentType,
      experience_required || 0,
      job_description,
      openings || 1,
      finalStatus,
    ],
  );

  const [newJobDescription] = await db(
    "SELECT * FROM job_descriptions WHERE id = ?",
    [result.insertId],
  );

  res.status(201).json({
    status: "success",
    data: {
      job_description: newJobDescription,
    },
  });
});

exports.getAllJobDescriptions = catchAsyncError(async (req, res) => {
  const jobDescriptions = await db(
    "SELECT * FROM job_descriptions ORDER BY id DESC",
  );

  res.status(200).json({
    status: "success",
    results: jobDescriptions.length,
    data: {
      job_descriptions: jobDescriptions,
    },
  });
});

exports.getJobDescriptionById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const [jobDescription] = await db(
    "SELECT * FROM job_descriptions WHERE id = ?",
    [id],
  );

  if (!jobDescription) {
    return next(new AppError("Job description not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      job_description: jobDescription,
    },
  });
});

exports.updateJobDescriptionById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const allowedFields = [
    "job_title",
    "location",
    "employment_type",
    "experience_required",
    "job_description",
    "openings",
    "status",
  ];

  if (
    req.body.employment_type &&
    !VALID_EMPLOYMENT_TYPES.includes(req.body.employment_type)
  ) {
    return next(
      new AppError(
        `employment_type must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`,
        400,
      ),
    );
  }

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return next(
      new AppError(`status must be one of: ${VALID_STATUSES.join(", ")}`, 400),
    );
  }

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
  const updateQuery = `UPDATE job_descriptions SET ${updates.join(", ")} WHERE id = ?`;
  const result = await db(updateQuery, values);

  if (result.affectedRows === 0) {
    return next(new AppError("Job description not found", 404));
  }

  const [updatedJobDescription] = await db(
    "SELECT * FROM job_descriptions WHERE id = ?",
    [id],
  );

  res.status(200).json({
    status: "success",
    data: {
      job_description: updatedJobDescription,
    },
  });
});

exports.deleteJobDescriptionById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM job_descriptions WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Job description not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Job description deleted successfully",
    data: null,
  });
});
