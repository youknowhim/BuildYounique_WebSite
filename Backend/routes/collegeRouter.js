const express = require("express");
const collegeController = require("../controllers/college/collegeController");

const router = express.Router();

router
  .route("/")
  .post(collegeController.createCollege)
  .get(collegeController.getAllColleges);

router
  .route("/:id")
  .get(collegeController.getCollegeById)
  .put(collegeController.updateCollegeById)
  .delete(collegeController.deleteCollegeById);

// need to pass college id
router
  .route("/promo-codes/:id")
  .get(collegeController.getPromoCodesByCollegeId);

module.exports = router;
