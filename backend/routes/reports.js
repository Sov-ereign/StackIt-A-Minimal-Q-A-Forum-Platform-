const express = require('express');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a report (auth required, but not guest)
router.post('/', auth, async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    
    // Check if user is not a guest
    if (req.user.role === 'guest') {
      return res.status(403).json({ message: 'Guests cannot report content' });
    }
    
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ message: 'Target type, target ID, and reason are required' });
    }
    
    if (!['question', 'answer', 'comment'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }
    
    // Check if user has already reported this content
    const existingReport = await Report.findOne({
      reporter: req.user.id,
      targetType,
      targetId
    });
    
    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this content' });
    }
    
    const report = new Report({
      reporter: req.user.id,
      targetType,
      targetId,
      reason,
      description
    });
    
    await report.save();
    
    // Transform response for frontend
    const reportObj = report.toObject();
    const transformedReport = {
      ...reportObj,
      id: reportObj._id
    };
    
    res.status(201).json(transformedReport);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reports
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.id }).sort({ createdAt: -1 });
    
    const transformedReports = reports.map(report => {
      const reportObj = report.toObject();
      return {
        ...reportObj,
        id: reportObj._id
      };
    });
    
    res.json(transformedReports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 