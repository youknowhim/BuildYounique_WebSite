const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createContactEnquiry = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, service_required, project_description } =
    req.body;

  if (!name || !email || !phone || !project_description) {
    return next(
      new AppError(
        "name, email, phone, and project_description are required",
        400,
      ),
    );
  }

  const result = await db(
    `INSERT INTO contact_enquiries (
        name,
        email,
        phone,
        service_required,
        project_description
      ) VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, service_required || null, project_description],
  );

  const [newEnquiry] = await db(
    "SELECT * FROM contact_enquiries WHERE id = ?",
    [result.insertId],
  );

  res.status(201).json({
    status: "success",
    data: {
      contact_enquiry: newEnquiry,
    },
  });
});
