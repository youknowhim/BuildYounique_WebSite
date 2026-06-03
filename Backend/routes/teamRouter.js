const express = require("express");
const teamController = require("../controllers/team/teamController");
const teamMemberController = require("../controllers/team/teamMemberController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Team member routes under /api/v1/teams/members
router.use("/members", teamController.teamProtect);
router
  .route("/members")
  .post(teamMemberController.createTeamMember)
  .get(teamMemberController.getAllTeamMembers);

router
  .route("/members/:id")
  .get(teamMemberController.getTeamMemberById)
  .put(teamMemberController.updateTeamMemberById)
  .delete(teamMemberController.deleteTeamMemberById);

// Email verification routes
router.post(
  "/members/verify-email",
  teamMemberController.verifyTeamMemberEmail,
);

// TEAMS ROUTES

// Login routes
router.post("/login", teamController.loginTeam);
router.post("/login/verify", teamController.verifyTeamLogin);
router.post("/verify-email", teamController.verifyTeamLeaderEmail);
// Team routes under /api/v1/teams
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
