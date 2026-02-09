const express = require("express");
const {
  createBug,
  assignBug,
  updateStatus,
  getBugs,
  getBugById,  // 🔥 ADD THIS to controller
  updateBug,   // 🔥 ADD THIS to controller (optional, for full CRUD)
  deleteBug
} = require("../controllers/bugController.js");

const protect = require("../middlewares/authMiddleware.js");
const authorize = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// List all bugs
router.get("/", protect, getBugs);

// Get single bug by ID - 🔥 THIS WAS MISSING!
router.get("/:id", protect, getBugById);

// Create bug
router.post("/", protect, createBug);

// Update bug (optional - for full CRUD)
router.put("/:id", protect, updateBug);

// Assign bug
router.patch("/:id/assign", protect, assignBug);

// Update bug status
router.patch("/:id/status", protect, updateStatus);

// Delete bug (ADMIN or TESTER only)
router.delete("/:id", protect, authorize("ADMIN", "TESTER"), deleteBug);

module.exports = router;