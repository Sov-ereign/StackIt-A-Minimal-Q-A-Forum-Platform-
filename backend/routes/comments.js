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
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedComments = comments.map(comment => {
      const commentObj = comment.toObject();
      return {
        ...commentObj,
        id: commentObj._id,
        answerId: commentObj.answer,
        author: commentObj.author ? {
          ...commentObj.author,
          id: commentObj.author._id,
          username: commentObj.author.username || 'Unknown User',
          reputation: commentObj.author.reputation || 0,
          avatar: commentObj.author.avatar || null
        } : {
          id: 'unknown',
          username: 'Unknown User',
          reputation: 0,
          avatar: null
        }
      };
    });
    
    res.json(transformedComments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a new comment (auth required)
router.post('/:answerId', auth, async (req, res) => {
  try {
    console.log('Comment POST request:', { 
      answerId: req.params.answerId, 
      body: req.body, 
      user: req.user 
    });
    
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
      // Get the current user's username
      const User = require('../models/User');
      const currentUser = await User.findById(req.user.id);
      
      const notification = new Notification({
        userId: answer.author,
        type: 'comment',
        message: `${currentUser.username} commented on your answer about "${question?.title || 'a question'}"`,
        questionId: answer.question,
        answerId: answer._id,
        commentId: comment._id
      });
      await notification.save();
    }
    
    // Check for mentions (@username)
    // Extract plain text from HTML content for mention detection
    const plainText = comment.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    const mentionRegex = /@(\w+)/g;
    const mentions = plainText.match(mentionRegex);
    console.log('Mention detection:', { 
      htmlContent: comment.content, 
      plainText: plainText, 
      mentions 
    });
    
    if (mentions) {
      const User = require('../models/User');
      const currentUser = await User.findById(req.user.id);
      
      for (const mention of mentions) {
        const username = mention.substring(1); // Remove @
        console.log('Looking for user:', username);
        const mentionedUser = await User.findOne({ username });
        console.log('Found user:', mentionedUser ? mentionedUser.username : 'not found');
        
        if (mentionedUser && mentionedUser._id.toString() !== req.user.id) {
          console.log('Creating mention notification for:', mentionedUser.username);
          const notification = new Notification({
            userId: mentionedUser._id,
            type: 'mention',
            message: `${currentUser.username} mentioned you in a comment`,
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
    
    // Transform the response to include id field
    const commentObj = comment.toObject();
    const transformedComment = {
      ...commentObj,
      id: commentObj._id,
      answerId: commentObj.answer,
      author: commentObj.author ? {
        ...commentObj.author,
        id: commentObj.author._id,
        username: commentObj.author.username || 'Unknown User',
        reputation: commentObj.author.reputation || 0,
        avatar: commentObj.author.avatar || null
      } : {
        id: 'unknown',
        username: 'Unknown User',
        reputation: 0,
        avatar: null
      }
    };
    
    console.log('Comment saved successfully:', transformedComment);
    res.status(201).json(transformedComment);
  } catch (err) {
    console.error('Error creating comment:', err);
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
    
    // Transform the response to include id field
    const commentObj = comment.toObject();
    const transformedComment = {
      ...commentObj,
      id: commentObj._id,
      answerId: commentObj.answer,
      author: commentObj.author ? {
        ...commentObj.author,
        id: commentObj.author._id,
        username: commentObj.author.username || 'Unknown User',
        reputation: commentObj.author.reputation || 0,
        avatar: commentObj.author.avatar || null
      } : {
        id: 'unknown',
        username: 'Unknown User',
        reputation: 0,
        avatar: null
      }
    };
    
    res.json(transformedComment);
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