const Project = require("../models/project.js");
const User = require("../models/user.js");
const Bug = require("../models/bug.js");

// CREATE PROJECT (ADMIN)
exports.createProject = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, description } = body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
      status: "ACTIVE", // default
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      message: "Internal server error while creating project",
    });
  }
};

// ADD MEMBER (ADMIN)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User already in project" });
    }

    project.members.push(userId);
    await project.save();

    res.json({ message: "Member added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROJECTS (Logged-in users) + DERIVED BUG STATE
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const bugs = await Bug.find({
          projectId: project._id,
          isDeleted: false,
        });

        let bugState = "EMPTY";

        if (bugs.length > 0) {
          if (bugs.some((b) => b.status === "OPEN")) {
            bugState = "OPEN";
          } else if (
            bugs.some((b) => b.status === "IN_PROGRESS")
          ) {
            bugState = "IN_PROGRESS";
          } else {
            bugState = "COMPLETED";
          }
        }

        return {
          ...project.toObject(),
          bugState, // 🔥 derived, not stored
        };
      })
    );

    res.json(enrichedProjects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

// UPDATE PROJECT STATUS (ADMIN ONLY)
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "ACTIVE",
      "ON_HOLD",
      "COMPLETED",
      "ARCHIVED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid project status",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.status = status;
    await project.save();

    res.json({
      message: "Project status updated successfully",
      status: project.status,
    });
  } catch (error) {
    console.error("Update project status error:", error);
    res.status(500).json({
      message: "Failed to update project status",
    });
  }
};
