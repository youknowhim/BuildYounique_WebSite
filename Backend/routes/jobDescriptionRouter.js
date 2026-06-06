const express = require("express");
const jobDescriptionController = require("../controllers/jobDescription/jobDescriptionController");

const router = express.Router();

router
  .route("/")
  .get(jobDescriptionController.getAllJobDescriptions)
  .post(jobDescriptionController.createJobDescription);

router
  .route("/:id")
  .get(jobDescriptionController.getJobDescriptionById)
  .put(jobDescriptionController.updateJobDescriptionById)
  .delete(jobDescriptionController.deleteJobDescriptionById);

module.exports = router;
