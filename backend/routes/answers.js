const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all answers for a question (public)
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId }).populate('author', 'username reputation avatar');
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new answer (auth required)
router.post('/:questionId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const answer = new Answer({
      question: req.params.questionId,
      content,
      author: req.user.id,
    });
    await answer.save();
    // Increment answerCount in Question
    await Question.findByIdAndUpdate(req.params.questionId, { $inc: { answerCount: 1 } });
    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 