const express = require('express');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all comments for an answer (public)
router.get('/:answerId', async (req, res) => {
  try {
    const comments = await Comment.find({ answer: req.params.answerId })
      .populate('author', 'username reputation avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new comment (auth required)
router.post('/:answerId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const comment = new Comment({
      answer: req.params.answerId,
      content,
      author: req.user.id,
    });
    
    await comment.save();
    
    // Create notification for answer author
    const answer = await Answer.findById(req.params.answerId);
    if (answer && answer.author.toString() !== req.user.id) {
      const question = await Question.findById(answer.question);
      const notification = new Notification({
        userId: answer.author,
        type: 'comment',
        message: `${req.user.username} commented on your answer about "${question?.title || 'a question'}"`,
        questionId: answer.question,
        answerId: answer._id,
        commentId: comment._id
      });
      await notification.save();
    }
    
    // Check for mentions (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions = comment.content.match(mentionRegex);
    if (mentions) {
      const User = require('../models/User');
      for (const mention of mentions) {
        const username = mention.substring(1); // Remove @
        const mentionedUser = await User.findOne({ username });
        if (mentionedUser && mentionedUser._id.toString() !== req.user.id) {
          const notification = new Notification({
            userId: mentionedUser._id,
            type: 'mention',
            message: `${req.user.username} mentioned you in a comment`,
            questionId: answer?.question,
            answerId: answer?._id,
            commentId: comment._id
          });
          await notification.save();
        }
      }
    }
    
    // Populate author info for response
    await comment.populate('author', 'username reputation avatar');
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a comment (auth required - only author can edit)
router.put('/:commentId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    comment.content = content;
    await comment.save();
    
    await comment.populate('author', 'username reputation avatar');
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment (auth required - only author can delete)
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 