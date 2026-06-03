const express = require("express");
const coursesController = require("../controllers/courses/coursesController");

const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(coursesController.createCourse);

router
  .route("/:id")
  .get(coursesController.getCourseById)
  .put(coursesController.updateCourseById)
  .delete(coursesController.deleteCourseById);

module.exports = router;
