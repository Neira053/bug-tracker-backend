const Bug = require("../models/bug");

const getProjectBugState = async (projectId) => {
  const bugs = await Bug.find({
    projectId,
    isDeleted: false,
  });

  if (bugs.length === 0) return "EMPTY";

  if (bugs.some((bug) => bug.status === "OPEN")) {
    return "OPEN";
  }

  if (bugs.some((bug) => bug.status === "IN_PROGRESS")) {
    return "IN_PROGRESS";
  }

  return "COMPLETED";
};

module.exports = getProjectBugState;
