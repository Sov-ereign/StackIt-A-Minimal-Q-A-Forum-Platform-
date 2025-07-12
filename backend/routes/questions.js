const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions (public)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().populate('author', 'username reputation avatar');
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedQuestions = questions.map(question => {
      const questionObj = question.toObject();
      return {
        ...questionObj,
        id: questionObj._id,
        author: questionObj.author ? {
          ...questionObj.author,
          id: questionObj.author._id,
          username: questionObj.author.username || 'Unknown User',
          reputation: questionObj.author.reputation || 0,
          avatar: questionObj.author.avatar || null
        } : {
          id: 'unknown',
          username: 'Unknown User',
          reputation: 0,
          avatar: null
        }
      };
    });
    
    res.json(transformedQuestions);
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
    
    // Transform the response to include id field
    const questionObj = question.toObject();
    const transformedQuestion = {
      ...questionObj,
      id: questionObj._id,
      author: {
        ...questionObj.author,
        id: questionObj.author._id
      }
    };
    
    res.status(201).json(transformedQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 