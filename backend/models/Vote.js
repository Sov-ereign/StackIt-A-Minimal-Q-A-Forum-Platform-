const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['question', 'answer'], required: true },
  type: { type: String, enum: ['up', 'down'], required: true },
});

module.exports = mongoose.model('Vote', voteSchema); 