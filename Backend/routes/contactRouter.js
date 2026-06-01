const express = require("express");
const contactController = require("../controllers/contact/contactController");

const router = express.Router();

router.route("/").post(contactController.createContactEnquiry);

module.exports = router;
