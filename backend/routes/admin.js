const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// All routes require both auth and admin middleware
router.use(auth);
router.use(admin);

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Transform data for frontend
    const transformedUsers = users.map(user => {
      const userObj = user.toObject();
      return {
        ...userObj,
        id: userObj._id
      };
    });
    
    res.json(transformedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Suspend user
router.post('/users/:userId/suspend', async (req, res) => {
  try {
    const { reason, duration } = req.body; // duration in days
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const suspendedUntil = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;
    
    user.status = 'suspended';
    user.suspendedUntil = suspendedUntil;
    user.suspensionReason = reason;
    await user.save();
    
    res.json({ message: 'User suspended successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban user
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = 'banned';
    user.suspensionReason = reason;
    await user.save();
    
    res.json({ message: 'User banned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Activate user
router.post('/users/:userId/activate', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = 'active';
    user.suspendedUntil = null;
    user.suspensionReason = null;
    await user.save();
    
    res.json({ message: 'User activated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change user role
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!['guest', 'user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== CONTENT MODERATION =====

// Get pending answers for approval
router.get('/answers/pending', async (req, res) => {
  try {
    const answers = await Answer.find({ 
      isApproved: false, 
      isRemoved: false 
    }).populate('author', 'username reputation avatar')
      .populate('question', 'title')
      .sort({ createdAt: -1 });
    
    const transformedAnswers = answers.map(answer => {
      const answerObj = answer.toObject();
      return {
        ...answerObj,
        id: answerObj._id,
        questionId: answerObj.question._id,
        author: answerObj.author ? {
          ...answerObj.author,
          id: answerObj.author._id
        } : null,
        question: {
          ...answerObj.question,
          id: answerObj.question._id
        }
      };
    });
    
    res.json(transformedAnswers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending comments for approval
router.get('/comments/pending', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      isApproved: false, 
      isRemoved: false 
    }).populate('author', 'username reputation avatar')
      .populate({
        path: 'answer',
        populate: { path: 'question', select: 'title' }
      })
      .sort({ createdAt: -1 });
    
    const transformedComments = comments.map(comment => {
      const commentObj = comment.toObject();
      return {
        ...commentObj,
        id: commentObj._id,
        answerId: commentObj.answer._id,
        author: commentObj.author ? {
          ...commentObj.author,
          id: commentObj.author._id
        } : null,
        answer: {
          ...commentObj.answer,
          id: commentObj.answer._id,
          question: {
            ...commentObj.answer.question,
            id: commentObj.answer.question._id
          }
        }
      };
    });
    
    res.json(transformedComments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve answer
router.post('/answers/:answerId/approve', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    answer.isApproved = true;
    await answer.save();
    
    res.json({ message: 'Answer approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve comment
router.post('/comments/:commentId/approve', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.isApproved = true;
    await comment.save();
    
    res.json({ message: 'Comment approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove content (question, answer, or comment)
router.post('/content/:type/:id/remove', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason } = req.body;
    
    let content;
    switch (type) {
      case 'question':
        content = await Question.findById(id);
        break;
      case 'answer':
        content = await Answer.findById(id);
        break;
      case 'comment':
        content = await Comment.findById(id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    content.isRemoved = true;
    content.removedBy = req.user.id;
    content.removedAt = new Date();
    content.removalReason = reason;
    await content.save();
    
    res.json({ message: 'Content removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== REPORT MANAGEMENT =====

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username')
      .populate('reviewedBy', 'username')
      .sort({ createdAt: -1 });
    
    const transformedReports = reports.map(report => {
      const reportObj = report.toObject();
      return {
        ...reportObj,
        id: reportObj._id,
        reporter: reportObj.reporter ? {
          ...reportObj.reporter,
          id: reportObj.reporter._id
        } : null,
        reviewedBy: reportObj.reviewedBy ? {
          ...reportObj.reviewedBy,
          id: reportObj.reviewedBy._id
        } : null
      };
    });
    
    res.json(transformedReports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Review report
router.post('/reports/:reportId/review', async (req, res) => {
  try {
    const { action, notes } = req.body;
    const report = await Report.findById(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    report.status = 'reviewed';
    report.adminAction = action;
    report.adminNotes = notes;
    report.reviewedBy = req.user.id;
    report.reviewedAt = new Date();
    await report.save();
    
    // Handle the action
    if (action === 'removed') {
      // Remove the reported content
      let content;
      switch (report.targetType) {
        case 'question':
          content = await Question.findById(report.targetId);
          break;
        case 'answer':
          content = await Answer.findById(report.targetId);
          break;
        case 'comment':
          content = await Comment.findById(report.targetId);
          break;
      }
      
      if (content) {
        content.isRemoved = true;
        content.removedBy = req.user.id;
        content.removedAt = new Date();
        content.removalReason = `Removed due to report: ${notes}`;
        await content.save();
      }
    } else if (action === 'user_suspended') {
      // Suspend the user who created the reported content
      let content;
      switch (report.targetType) {
        case 'question':
          content = await Question.findById(report.targetId);
          break;
        case 'answer':
          content = await Answer.findById(report.targetId);
          break;
        case 'comment':
          content = await Comment.findById(report.targetId);
          break;
      }
      
      if (content) {
        const user = await User.findById(content.author);
        if (user) {
          user.status = 'suspended';
          user.suspensionReason = `Suspended due to reported content: ${notes}`;
          await user.save();
        }
      }
    }
    
    res.json({ message: 'Report reviewed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ===== DASHBOARD STATS =====

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ status: 'active' }),
      suspendedUsers: await User.countDocuments({ status: 'suspended' }),
      bannedUsers: await User.countDocuments({ status: 'banned' }),
      pendingAnswers: await Answer.countDocuments({ isApproved: false, isRemoved: false }),
      pendingComments: await Comment.countDocuments({ isApproved: false, isRemoved: false }),
      pendingReports: await Report.countDocuments({ status: 'pending' }),
      totalQuestions: await Question.countDocuments(),
      totalAnswers: await Answer.countDocuments(),
      totalComments: await Comment.countDocuments()
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 