const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  state: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Account', AccountSchema);