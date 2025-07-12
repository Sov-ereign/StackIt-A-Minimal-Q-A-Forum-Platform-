const express = require('express');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

const router = express.Router();

// Report content (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { targetId, targetType, reason, description } = req.body;
    
    if (!targetId || !targetType || !reason) {
      return res.status(400).json({ message: 'Target ID, type, and reason are required' });
    }

    if (!['question', 'answer', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    // Check if user already reported this content
    const existingReport = await Report.findOne({
      reporter: req.user.id,
      targetId,
      targetType
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this content' });
    }

    const report = new Report({
      reporter: req.user.id,
      targetId,
      targetType,
      reason,
      description
    });

    await report.save();
    res.status(201).json({ message: 'Content reported successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reports (admin only - for future use)
router.get('/', auth, async (req, res) => {
  try {
    // Only allow admins to view reports
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reports = await Report.find()
      .populate('reporter', 'username email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 