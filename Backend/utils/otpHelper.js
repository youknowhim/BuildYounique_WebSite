// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get OTP expiry time (10 minutes from now)
const getOTPExpiryTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  return now;
};

module.exports = {
  generateOTP,
  getOTPExpiryTime,
};
