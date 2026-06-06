const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./utils/globalErrorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.js");
const path = require("path");

const user_Router = require("./routes/userRouter.js");
const collegeRouter = require("./routes/collegeRouter.js");
const teamRouter = require("./routes/teamRouter.js");
const careerRouter = require("./routes/careerRouter.js");
const contactRouter = require("./routes/contactRouter.js");
const hackathonEventRouter = require("./routes/hackathonEventRouter.js");
const coursesRouter = require("./routes/coursesRouter.js");
const trainingRouter = require("./routes/trainingRouter.js");
const jobDescriptionRouter = require("./routes/jobDescriptionRouter.js");
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (resumes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.use("/api/v1/users", user_Router);
app.use("/api/v1/colleges", collegeRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/career-applications", careerRouter);
app.use("/api/v1/contact-enquiries", contactRouter);
app.use("/api/v1/hackathon-events", hackathonEventRouter);
app.use("/api/v1/job-descriptions", jobDescriptionRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/trainings", trainingRouter);

app.get("/health", (req, res) => {
  res.status(200).send("API server up");
});

app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      ok: false,
      message: "Missing message",
    });
  }

  try {
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history.slice(-8).map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.7,
          max_tokens: 400,
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API Error:", response.status, errText);

      return res.status(502).json({
        ok: false,
        message: "AI service unavailable",
      });
    }

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.json({
      ok: true,
      reply,
    });
  } catch (err) {
    console.error("Chat Error:", err);

    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
});

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
