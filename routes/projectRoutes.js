const express = require("express");

const {
  createProject,
  addMember,
  removeMember,        // 🔥 ADD THIS to controller
  getProjects,
  getProjectById,      // 🔥 ADD THIS to controller
  updateProject,       // 🔥 ADD THIS to controller (general update)
  updateProjectStatus,
  deleteProject,       // 🔥 ADD THIS to controller
} = require("../controllers/projectController.js");

const protect = require("../middlewares/authMiddleware.js");
const authorize = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// Get all projects (all logged-in users can view)
router.get("/", protect, getProjects);

// Get single project by ID - 🔥 THIS WAS MISSING!
router.get("/:id", protect, getProjectById);

// Create project (ADMIN only)
router.post("/", protect, authorize("ADMIN"), createProject);

// Update project (ADMIN only) - 🔥 THIS WAS MISSING!
router.put("/:id", protect, authorize("ADMIN"), updateProject);

// Update project status (ADMIN only)
router.patch("/:id/status", protect, authorize("ADMIN"), updateProjectStatus);

// Delete project (ADMIN only) - 🔥 THIS WAS MISSING!
router.delete("/:id", protect, authorize("ADMIN"), deleteProject);

// Add member to project (ADMIN only)
router.post("/:id/members", protect, authorize("ADMIN"), addMember);

// Remove member from project (ADMIN only) - 🔥 THIS WAS MISSING!
router.delete("/:id/members/:userId", protect, authorize("ADMIN"), removeMember);

module.exports = router;