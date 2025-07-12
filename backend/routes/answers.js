const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all answers for a question (public) - only approved answers
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ 
      question: req.params.questionId,
      isApproved: true,
      isRemoved: false
    }).populate('author', 'username reputation avatar');
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedAnswers = answers.map(answer => {
      const answerObj = answer.toObject();
      return {
        ...answerObj,
        id: answerObj._id,
        questionId: answerObj.question,
        author: answerObj.author ? {
          ...answerObj.author,
          id: answerObj.author._id
        } : null
      };
    });
    
    res.json(transformedAnswers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new answer (auth required) - requires approval
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
      isApproved: false, // New answers need approval
    });
    await answer.save();
    
    // Don't increment answerCount until approved
    // await Question.findByIdAndUpdate(req.params.questionId, { $inc: { answerCount: 1 } });
    
    // Transform the response to include id field
    const answerObj = answer.toObject();
    const transformedAnswer = {
      ...answerObj,
      id: answerObj._id,
      questionId: answerObj.question,
      author: {
        ...answerObj.author,
        id: answerObj.author._id
      }
    };
    
    res.status(201).json(transformedAnswer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 