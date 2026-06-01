const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createCareerApplication = catchAsyncError(async (req, res, next) => {
  const {
    full_name,
    email,
    phone,
    applying_role,
    years_of_experience,
    skills,
    resume_url,
    resume_file_name,
    resume_file_size,
    linkedin_url,
    portfolio_url,
    github_url,
    current_location,
    college_name,
    current_company,
    current_ctc,
    expected_ctc,
    notice_period_days,
    cover_letter,
  } = req.body;

  if (
    !full_name ||
    !email ||
    !phone ||
    !applying_role ||
    !skills ||
    !resume_url
  ) {
    return next(
      new AppError(
        "full_name, email, phone, applying_role, skills, and resume_url are required",
        400,
      ),
    );
  }

  let skillsValue = skills;

  if (Array.isArray(skills)) {
    skillsValue = JSON.stringify(skills);
  } else if (typeof skills === "string") {
    try {
      JSON.parse(skills);
    } catch (err) {
      return next(
        new AppError("skills must be a JSON array or a JSON string", 400),
      );
    }
  } else {
    return next(new AppError("skills must be an array or a JSON string", 400));
  }

  const result = await db(
    `INSERT INTO career_applications (
        full_name,
        email,
        phone,
        applying_role,
        years_of_experience,
        skills,
        resume_url,
        resume_file_name,
        resume_file_size,
        linkedin_url,
        portfolio_url,
        github_url,
        current_location,
        college_name,
        current_company,
        current_ctc,
        expected_ctc,
        notice_period_days,
        cover_letter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      full_name,
      email,
      phone,
      applying_role,
      years_of_experience || 0,
      skillsValue,
      resume_url,
      resume_file_name || null,
      resume_file_size || null,
      linkedin_url || null,
      portfolio_url || null,
      github_url || null,
      current_location || null,
      college_name || null,
      current_company || null,
      current_ctc || null,
      expected_ctc || null,
      notice_period_days || null,
      cover_letter || null,
    ],
  );

  const [newApplication] = await db(
    "SELECT * FROM career_applications WHERE id = ?",
    [result.insertId],
  );

  res.status(201).json({
    status: "success",
    data: {
      career_application: newApplication,
    },
  });
});
