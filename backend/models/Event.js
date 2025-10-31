const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
    default: 'BUSY',
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);