const Project = require("../models/project.js");
const User = require("../models/user.js");

// CREATE PROJECT (ADMIN)
exports.createProject = async (req, res) => {
  try {
    // ✅ SAFE destructuring
    const body = req.body || {};
    const { name, description } = body;

    // ✅ VALIDATION (client error, not server crash)
    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    // ✅ AUTH SAFETY
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

// GET PROJECTS (Logged-in users)
exports.getProjects = async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
    .populate("createdBy", "name email")
    .populate("members", "name email");

  res.json(projects);
};
