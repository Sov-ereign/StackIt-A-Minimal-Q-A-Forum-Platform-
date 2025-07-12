const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  answerCount: { type: Number, default: 0 },
  acceptedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
  views: { type: Number, default: 0 },
  // Moderation fields
  isApproved: { type: Boolean, default: true }, // Questions are auto-approved
  isRemoved: { type: Boolean, default: false },
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removedAt: { type: Date },
  removalReason: { type: String },
});

module.exports = mongoose.model('Question', questionSchema); 