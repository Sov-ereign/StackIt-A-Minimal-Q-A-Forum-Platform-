const express = require('express');
const Comment = require('../models/Comment');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all comments for an answer (public) - only approved comments
router.get('/:answerId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      answer: req.params.answerId,
      isApproved: true,
      isRemoved: false
    }).populate('author', 'username reputation avatar')
      .sort({ createdAt: 1 });
    
    // Transform data for frontend
    const transformedComments = comments.map(comment => {
      const commentObj = comment.toObject();
      return {
        ...commentObj,
        id: commentObj._id,
        answerId: commentObj.answer,
        author: commentObj.author ? {
          ...commentObj.author,
          id: commentObj.author._id
        } : null
      };
    });
    
    res.json(transformedComments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new comment (auth required) - requires approval
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
      isApproved: false, // New comments need approval
    });
    
    await comment.save();
    
    // Populate author info for response
    await comment.populate('author', 'username reputation avatar');
    
    // Transform data for frontend
    const commentObj = comment.toObject();
    const transformedComment = {
      ...commentObj,
      id: commentObj._id,
      answerId: commentObj.answer,
      author: commentObj.author ? {
        ...commentObj.author,
        id: commentObj.author._id
      } : null
    };
    
    res.status(201).json(transformedComment);
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