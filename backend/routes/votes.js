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
    
    // Check for existing vote
    const existingVote = await Vote.findOne({ user: req.user.id, targetId, targetType });
    
    if (existingVote) {
      if (existingVote.type === type) {
        // Same vote type - remove the vote
        await Vote.findByIdAndDelete(existingVote._id);
        const voteChange = type === 'up' ? -1 : 1; // Reverse the vote
        if (targetType === 'question') {
          await Question.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
        } else {
          await Answer.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
        }
        res.json({ message: 'Vote removed', action: 'removed' });
      } else {
        // Different vote type - change the vote
        existingVote.type = type;
        await existingVote.save();
        const voteChange = type === 'up' ? 2 : -2; // +2 for up, -2 for down (removing old vote and adding new one)
        if (targetType === 'question') {
          await Question.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
        } else {
          await Answer.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
        }
        res.json({ message: 'Vote changed', action: 'changed' });
      }
    } else {
      // New vote
      const vote = new Vote({ user: req.user.id, targetId, targetType, type });
      await vote.save();
      const voteChange = type === 'up' ? 1 : -1;
      if (targetType === 'question') {
        await Question.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
      } else {
        await Answer.findByIdAndUpdate(targetId, { $inc: { votes: voteChange } });
      }
      res.status(201).json({ message: 'Voted', action: 'added' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's vote for a specific target
router.get('/:targetType/:targetId', auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    if (!['question', 'answer'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }
    
    const vote = await Vote.findOne({ 
      user: req.user.id, 
      targetId, 
      targetType 
    });
    
    res.json({ vote: vote ? vote.type : null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 