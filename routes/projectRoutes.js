const express = require("express");

const {
  createProject,
  addMember,
  getProjects,
  updateProjectStatus, // 🔥 NEW
} = require("../controllers/projectController.js");

const protect = require("../middlewares/authMiddleware.js");
const authorize = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Create project (ADMIN)
router.post("/", protect, authorize("ADMIN"), createProject);

// Add member to project (ADMIN)
router.post("/:id/members", protect, authorize("ADMIN"), addMember);

// Get projects (all logged-in users)
router.get("/", protect, getProjects);

// 🔥 Update project status (ADMIN only)
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateProjectStatus
);

module.exports = router;

