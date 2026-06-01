const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./utils/globalErrorHandler");

const user_Router = require("./routes/userRouter.js");
const collegeRouter = require("./routes/collegeRouter.js");
const teamRouter = require("./routes/teamRouter.js");
const careerRouter = require("./routes/careerRouter.js");
const contactRouter = require("./routes/contactRouter.js");
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", user_Router);
app.use("/api/v1/colleges", collegeRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/career-applications", careerRouter);
app.use("/api/v1/contact-enquiries", contactRouter);

app.get("/health", (req, res) => {
  res.status(200).send("API server up");
});

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
