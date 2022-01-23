const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  labels: {
    type: [String],
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Project', ProjectSchema);