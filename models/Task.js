const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: Boolean,
    default: false
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  attendant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Task", TaskSchema);