const express = require("express");
const careerController = require("../controllers/career/careerController");

const router = express.Router();

router.route("/").post(careerController.createCareerApplication);

module.exports = router;
