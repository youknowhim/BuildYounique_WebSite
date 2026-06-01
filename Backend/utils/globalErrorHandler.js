const AppError = require("./appError");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
