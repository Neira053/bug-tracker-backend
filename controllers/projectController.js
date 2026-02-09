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
      status: "ACTIVE",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      message: "Internal server error while creating project",
    });
  }
};

// 🔥 GET SINGLE PROJECT BY ID - THIS WAS MISSING!
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get bugs for this project to compute bugState
    const bugs = await Bug.find({
      projectId: project._id,
      isDeleted: false,
    });

    let bugState = "EMPTY";

    if (bugs.length > 0) {
      if (bugs.some((b) => b.status === "OPEN")) {
        bugState = "OPEN";
      } else if (bugs.some((b) => b.status === "IN_PROGRESS")) {
        bugState = "IN_PROGRESS";
      } else {
        bugState = "COMPLETED";
      }
    }

    res.json({
      ...project.toObject(),
      bugState,
    });
  } catch (error) {
    console.error("Get project by ID error:", error);
    res.status(500).json({
      message: "Failed to fetch project",
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

// 🔥 REMOVE MEMBER (ADMIN) - THIS WAS MISSING!
exports.removeMember = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is actually a member
    const memberIndex = project.members.findIndex(
      (memberId) => memberId.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(400).json({ message: "User is not a member of this project" });
    }

    // Remove member
    project.members.splice(memberIndex, 1);
    await project.save();

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ message: "Failed to remove member" });
  }
};

// GET PROJECTS (ALL USERS) + DERIVED BUG STATE ✅
exports.getProjects = async (req, res) => {
  try {
    // 🔥 CHANGE IS HERE: removed members filter
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email role");

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
          } else if (bugs.some((b) => b.status === "IN_PROGRESS")) {
            bugState = "IN_PROGRESS";
          } else {
            bugState = "COMPLETED";
          }
        }

        return {
          ...project.toObject(),
          bugState,
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

// 🔥 UPDATE PROJECT (GENERAL) - THIS WAS MISSING!
exports.updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields if provided
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) {
      const allowedStatuses = ["ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid project status" });
      }
      project.status = status;
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email")
      .populate("members", "name email role");

    res.json(updatedProject);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      message: "Failed to update project",
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

// 🔥 DELETE PROJECT (ADMIN) - THIS WAS MISSING!
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Soft delete - add a deleted field
    project.deleted = true;
    await project.save();

    // Or hard delete (uncomment if you prefer):
    // await Project.findByIdAndDelete(req.params.id);

    res.json({ 
      message: "Project deleted successfully",
      projectId: req.params.id
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};