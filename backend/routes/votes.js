const express = require('express');
const Vote = require('../models/Vote');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Vote on a question or answer
router.post('/', auth, async (req, res) => {
  try {
    const { targetId, targetType, type } = req.body;
    if (!targetId || !targetType || !['question', 'answer'].includes(targetType) || !['up', 'down'].includes(type)) {
      return res.status(400).json({ message: 'Invalid vote data' });
    }
    // Prevent duplicate votes
    const existing = await Vote.findOne({ user: req.user.id, targetId, targetType });
    if (existing) {
      return res.status(400).json({ message: 'Already voted' });
    }
    const vote = new Vote({ user: req.user.id, targetId, targetType, type });
    await vote.save();
    // Update vote count
    if (targetType === 'question') {
      await Question.findByIdAndUpdate(targetId, { $inc: { votes: type === 'up' ? 1 : -1 } });
    } else {
      await Answer.findByIdAndUpdate(targetId, { $inc: { votes: type === 'up' ? 1 : -1 } });
    }
    res.status(201).json({ message: 'Voted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 