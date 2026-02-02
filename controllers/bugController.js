const Bug = require("../models/bug.js");

// CREATE BUG (TESTER only)
exports.createBug = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "TESTER") {
      return res.status(403).json({ message: "Only testers can create bugs" });
    }

    const { title, description, priority, projectId } = req.body || {};

    if (!title) {
      return res.status(400).json({ message: "Bug title is required" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const bug = await Bug.create({
      title,
      description,
      priority,
      projectId,
      reporter: req.user._id,
      history: [{ status: "OPEN", changedBy: req.user._id }]
    });

    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};

// ASSIGN BUG (ADMIN only)
exports.assignBug = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can assign bugs" });
    }

    const { assigneeId } = req.body;
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    bug.assignee = assigneeId;
    await bug.save();

    res.json({ message: "Bug assigned successfully" });
  } catch (error) {
    next(error);
  }
};

// UPDATE BUG STATUS (DEV & TESTER with rules)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    if (req.user.role === "DEV" && !["IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(403).json({ message: "Invalid status for developer" });
    }

    if (req.user.role === "TESTER" && status !== "CLOSED") {
      return res.status(403).json({ message: "Tester can only close bugs" });
    }

    bug.status = status;
    bug.history.push({ status, changedBy: req.user._id });

    await bug.save();
    res.json(bug);
  } catch (error) {
    next(error);
  }
};

// GET BUGS (FILTERING + PAGINATION)
exports.getBugs = async (req, res, next) => {
  try {
    const { projectId, status, priority } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    };

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const bugs = await Bug.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("reporter", "name")
      .populate("assignee", "name")
      .populate("projectId", "name");

    const total = await Bug.countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      bugs
    });
  } catch (error) {
    next(error);
  }
};

// DELETE BUG (SOFT DELETE – ADMIN only)
exports.deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    bug.isDeleted = true;
    await bug.save();

    res.json({ message: "Bug soft deleted" });
  } catch (error) {
    next(error);
  }
};
