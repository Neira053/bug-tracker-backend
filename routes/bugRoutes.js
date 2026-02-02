const express = require("express");
const {
  createBug,
  assignBug,
  updateStatus,
  getBugs,
  deleteBug
} = require("../controllers/bugController.js");

const protect = require("../middlewares/authMiddleware.js");
const authorize = require("../middlewares/roleMiddleware.js");


const router = express.Router();

router.post("/", protect, createBug);
router.get("/", protect, getBugs);

router.patch("/:id/assign", protect, assignBug);
router.patch("/:id/status", protect, updateStatus);
router.delete("/:id", protect, authorize("ADMIN"), deleteBug);



module.exports = router;
