const express = require("express");
const {
  createProject,
  addMember,
  getProjects
} = require("../controllers/projectController.js");

const protect = require("../middlewares/authMiddleware.js");
const authorize = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.post("/", protect, authorize("ADMIN"), createProject);
router.post("/:id/members", protect, authorize("ADMIN"), addMember);
router.get("/", protect, getProjects);

module.exports = router;
