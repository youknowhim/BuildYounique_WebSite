const express = require("express");
const trainingController = require("../controllers/training/trainingController");

const router = express.Router();

router
  .route("/")
  .get(trainingController.getAllTrainings)
  .post(trainingController.createTraining);
router
  .route("/:id")
  .get(trainingController.getTrainingById)
  .put(trainingController.updateTrainingById)
  .delete(trainingController.deleteTrainingById);

module.exports = router;
