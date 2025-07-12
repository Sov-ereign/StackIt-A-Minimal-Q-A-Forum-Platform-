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
});

module.exports = mongoose.model('Question', questionSchema); 