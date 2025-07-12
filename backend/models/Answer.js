const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
  // Moderation fields
  isApproved: { type: Boolean, default: false }, // Answers need approval
  isRemoved: { type: Boolean, default: false },
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removedAt: { type: Date },
  removalReason: { type: String },
});

module.exports = mongoose.model('Answer', answerSchema); 