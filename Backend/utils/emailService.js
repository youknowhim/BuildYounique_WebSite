const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
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
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
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
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
        ${otp}
      </h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this login, please ignore this email.</p>
      <p>Best regards,<br>BuildYounique Team</p>
    `;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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

module.exports = {
  sendVerificationEmail,
};
