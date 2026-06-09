// const nodemailer = require("nodemailer");

// // Create email transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const sendVerificationEmail = async (
//   recipientEmail,
//   recipientName,
//   otp,
//   purpose,
// ) => {
//   let subject, htmlContent;

//   if (purpose === "TEAM_LEADER_VERIFICATION") {
//     subject = "Verify Your Email - Team Leader Registration";
//     htmlContent = `
//       <h2>Team Leader Email Verification</h2>
//       <p>Hi ${recipientName},</p>
//       <p>Thank you for registering your team! Please verify your email using the OTP below:</p>
//       <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
//         ${otp}
//       </h3>
//       <p>This OTP is valid for 10 minutes.</p>
//       <p>If you did not register, please ignore this email.</p>
//       <p>Best regards,<br>BuildYounique Team</p>
//     `;
//   } else if (purpose === "TEAM_MEMBER_VERIFICATION") {
//     subject = "Verify Your Email - Team Member Registration";
//     htmlContent = `
//       <h2>Team Member Email Verification</h2>
//       <p>Hi ${recipientName},</p>
//       <p>You have been added to a team. Please verify your email using the OTP below:</p>
//       <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
//         ${otp}
//       </h3>
//       <p>This OTP is valid for 10 minutes.</p>
//       <p>If you did not sign up, please ignore this email.</p>
//       <p>Best regards,<br>BuildYounique Team</p>
//     `;
//   } else if (purpose === "TEAM_LOGIN") {
//     subject = "Your Team Login OTP";
//     htmlContent = `
//       <h2>Team Login OTP</h2>
//       <p>Hi ${recipientName},</p>
//       <p>Your login code is:</p>
//       <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
//         ${otp}
//       </h3>
//       <p>This OTP is valid for 10 minutes.</p>
//       <p>If you did not request this login, please ignore this email.</p>
//       <p>Best regards,<br>BuildYounique Team</p>
//     `;
//   }

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: recipientEmail,
//       subject,
//       html: htmlContent,
//     });
//     console.log(`Email sent to ${recipientEmail}`);
//     return true;
//   } catch (error) {
//     console.error(`Failed to send email to ${recipientEmail}:`, error);
//     return false;
//   }
// };

// const fs = require("fs");
// const path = require("path");

// const sendCareerApplicationEmail = async (hrEmail, application) => {
//   const subject = `New Career Application: ${application.full_name} - ${application.applying_role}`;

//   const htmlContent = `
//     <h2>New Career Application</h2>
//     <p><strong>Name:</strong> ${application.full_name}</p>
//     <p><strong>Email:</strong> ${application.email}</p>
//     <p><strong>Phone:</strong> ${application.phone}</p>
//     <p><strong>Applying For:</strong> ${application.applying_role}</p>
//     <p><strong>Experience:</strong> ${application.years_of_experience || 0}</p>
//     <p><strong>Skills:</strong> ${application.skills}</p>
//     <p><strong>LinkedIn:</strong> ${application.linkedin_url || "-"}</p>
//     <p><strong>Portfolio:</strong> ${application.portfolio_url || "-"}</p>
//     <p><strong>Github:</strong> ${application.github_url || "-"}</p>
//     <p><strong>Current Company:</strong> ${application.current_company || "-"}</p>
//     <p><strong>Current CTC:</strong> ${application.current_ctc || "-"}</p>
//     <p><strong>Expected CTC:</strong> ${application.expected_ctc || "-"}</p>
//     <p><strong>Notice Period (days):</strong> ${application.notice_period_days || "-"}</p>
//     <p><strong>Location:</strong> ${application.current_location || "-"}</p>
//     <p><strong>College:</strong> ${application.college_name || "-"}</p>
//     <p><strong>Cover Letter:</strong></p>
//     <div style="border:1px solid #eee;padding:10px;border-radius:4px;">${
//       application.cover_letter || "-"
//     }</div>
//     <p><strong>Resume:</strong> ${application.resume_url || "-"}</p>
//   `;

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: hrEmail,
//     subject,
//     html: htmlContent,
//   };

//   // Try to attach resume if file is stored locally under ./uploads/resumes
//   try {
//     if (application.resume_file_name) {
//       const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
//       const filePath = path.join(uploadsDir, application.resume_file_name);
//       if (fs.existsSync(filePath)) {
//         mailOptions.attachments = [
//           {
//             filename: application.resume_file_name,
//             path: filePath,
//           },
//         ];
//       }
//     }
//   } catch (err) {
//     console.error("Error while checking resume attachment:", err);
//   }

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Career application email sent to ${hrEmail}`);
//     return true;
//   } catch (err) {
//     console.error("Failed to send career application email:", err);
//     return false;
//   }
// };

// module.exports = {
//   sendVerificationEmail,
//   sendCareerApplicationEmail,
// };

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// ================================
// BREVO SMTP CONFIGURATION
// ================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Test SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("Brevo SMTP Connected Successfully");
  }
});

// ================================
// OTP / VERIFICATION EMAIL
// ================================
const sendVerificationEmail = async (
  recipientEmail,
  recipientName,
  otp,
  purpose,
) => {
  let subject, htmlContent;

  if (purpose === "TEAM_LEADER_VERIFICATION") {
    subject = "Verify Your Email - Team Leader Registration";
    htmlContent = `
      <h2>Team Leader Email Verification</h2>
      <p>Hi ${recipientName},</p>
      <p>Thank you for registering your team! Please verify your email using the OTP below:</p>
      <h3 style="background-color:#f0f0f0;padding:10px;border-radius:5px;text-align:center;">
        ${otp}
      </h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not register, please ignore this email.</p>
      <p>Best regards,<br>BuildYounique Team</p>
    `;
  } else if (purpose === "TEAM_MEMBER_VERIFICATION") {
    subject = "Verify Your Email - Team Member Registration";
    htmlContent = `
      <h2>Team Member Email Verification</h2>
      <p>Hi ${recipientName},</p>
      <p>You have been added to a team. Please verify your email using the OTP below:</p>
      <h3 style="background-color:#f0f0f0;padding:10px;border-radius:5px;text-align:center;">
        ${otp}
      </h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not sign up, please ignore this email.</p>
      <p>Best regards,<br>BuildYounique Team</p>
    `;
  } else if (purpose === "TEAM_LOGIN") {
    subject = "Your Team Login OTP";
    htmlContent = `
      <h2>Team Login OTP</h2>
      <p>Hi ${recipientName},</p>
      <p>Your login code is:</p>
      <h3 style="background-color:#f0f0f0;padding:10px;border-radius:5px;text-align:center;">
        ${otp}
      </h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this login, please ignore this email.</p>
      <p>Best regards,<br>BuildYounique Team</p>
    `;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${recipientEmail}:`, error);
    return false;
  }
};

// ================================
// CAREER APPLICATION EMAIL
// ================================
const sendCareerApplicationEmail = async (hrEmail, application) => {
  const subject = `New Career Application: ${application.full_name} - ${application.applying_role}`;

  const htmlContent = `
    <h2>New Career Application</h2>

    <p><strong>Name:</strong> ${application.full_name}</p>
    <p><strong>Email:</strong> ${application.email}</p>
    <p><strong>Phone:</strong> ${application.phone}</p>
    <p><strong>Applying For:</strong> ${application.applying_role}</p>
    <p><strong>Experience:</strong> ${application.years_of_experience || 0}</p>
    <p><strong>Skills:</strong> ${application.skills}</p>
    <p><strong>LinkedIn:</strong> ${application.linkedin_url || "-"}</p>
    <p><strong>Portfolio:</strong> ${application.portfolio_url || "-"}</p>
    <p><strong>Github:</strong> ${application.github_url || "-"}</p>
    <p><strong>Current Company:</strong> ${
      application.current_company || "-"
    }</p>
    <p><strong>Current CTC:</strong> ${application.current_ctc || "-"}</p>
    <p><strong>Expected CTC:</strong> ${application.expected_ctc || "-"}</p>
    <p><strong>Notice Period:</strong> ${
      application.notice_period_days || "-"
    }</p>
    <p><strong>Location:</strong> ${application.current_location || "-"}</p>
    <p><strong>College:</strong> ${application.college_name || "-"}</p>

    <p><strong>Cover Letter:</strong></p>
    <div style="border:1px solid #eee;padding:10px;border-radius:4px;">
      ${application.cover_letter || "-"}
    </div>

    <p><strong>Resume:</strong> ${application.resume_url || "-"}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: hrEmail,
    subject,
    html: htmlContent,
  };

  try {
    if (application.resume_file_name) {
      const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");

      const filePath = path.join(uploadsDir, application.resume_file_name);

      if (fs.existsSync(filePath)) {
        mailOptions.attachments = [
          {
            filename: application.resume_file_name,
            path: filePath,
          },
        ];
      }
    }
  } catch (err) {
    console.error("Error while checking resume attachment:", err);
  }

  try {
    await transporter.sendMail(mailOptions);

    console.log(`Career application email sent successfully to ${hrEmail}`);

    return true;
  } catch (err) {
    console.error("Failed to send career application email:", err);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendCareerApplicationEmail,
};
