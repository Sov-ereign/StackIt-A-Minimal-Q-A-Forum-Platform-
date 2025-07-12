const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['answer', 'comment', 'mention'], required: true },
  message: { type: String, required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema); 