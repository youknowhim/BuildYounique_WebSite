const express = require("express");
const teamController = require("../controllers/team/teamController");

const router = express.Router();

router
  .route("/")
  .post(teamController.createTeam)
  .get(teamController.getAllTeams);

router
  .route("/:id")
  .get(teamController.getTeamById)
  .put(teamController.updateTeamById)
  .delete(teamController.deleteTeamById);

module.exports = router;
