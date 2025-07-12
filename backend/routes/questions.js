const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions (public)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('author', 'username reputation avatar');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new question (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const question = new Question({
      title,
      description,
      tags,
      author: req.user.id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 