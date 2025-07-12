const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  // Moderation fields
  isApproved: { type: Boolean, default: false }, // Comments need approval
  isRemoved: { type: Boolean, default: false },
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removedAt: { type: Date },
  removalReason: { type: String },
});

module.exports = mongoose.model('Comment', commentSchema); 