const express = require('express');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all answers for a question (public)
router.get('/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId }).populate('author', 'username reputation avatar');
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedAnswers = answers.map(answer => {
      const answerObj = answer.toObject();
      return {
        ...answerObj,
        id: answerObj._id,
        questionId: answerObj.question,
        author: answerObj.author ? {
          ...answerObj.author,
          id: answerObj.author._id,
          username: answerObj.author.username || 'Unknown User',
          reputation: answerObj.author.reputation || 0,
          avatar: answerObj.author.avatar || null
        } : {
          id: 'unknown',
          username: 'Unknown User',
          reputation: 0,
          avatar: null
        }
      };
    });
    
    res.json(transformedAnswers);
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
    
    // Create notification for question author
    const question = await Question.findById(req.params.questionId);
    if (question && question.author.toString() !== req.user.id) {
      // Get the current user's username
      const User = require('../models/User');
      const currentUser = await User.findById(req.user.id);
      
      const notification = new Notification({
        userId: question.author,
        type: 'answer',
        message: `${currentUser.username} answered your question "${question.title}"`,
        questionId: question._id,
        answerId: answer._id
      });
      await notification.save();
    }
    
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