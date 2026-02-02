const mongoose = require("mongoose");


const historySchema = new mongoose.Schema({
  status: String,
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN"
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM"
    },

    isDeleted: {
  type: Boolean,
  default: false
},

    history: [historySchema]
  },
  { timestamps: true }
);

bugSchema.index({ projectId: 1, status: 1 });
bugSchema.index({ assignee: 1 });


module.exports = mongoose.model("Bug", bugSchema);
