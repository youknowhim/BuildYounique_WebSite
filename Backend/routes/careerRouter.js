// const express = require("express");
// const careerController = require("../controllers/career/careerController");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();

// // ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
// fs.mkdirSync(uploadsDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => {
//     const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
//     cb(null, safeName);
//   },
// });

// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// router
//   .route("/")
//   .post(upload.single("resume"), careerController.createCareerApplication);

// module.exports = router;

const express = require("express");
const careerController = require("../controllers/career/careerController");

const router = express.Router();

router.route("/").post(careerController.createCareerApplication);

module.exports = router;
