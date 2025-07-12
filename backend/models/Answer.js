const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Answer', answerSchema); 