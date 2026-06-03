const express = require("express");
const hackathonEventController = require("../controllers/hackathonEvent/hackathonEventController");

const router = express.Router();

router
  .route("/")
  .post(hackathonEventController.createHackathonEvent)
  .get(hackathonEventController.getAllHackathonEvents);

router
  .route("/:id")
  .get(hackathonEventController.getHackathonEventById)
  .put(hackathonEventController.updateHackathonEventById)
  .delete(hackathonEventController.deleteHackathonEventById);

module.exports = router;
