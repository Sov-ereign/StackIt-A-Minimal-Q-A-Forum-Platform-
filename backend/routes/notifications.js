const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's notifications (auth required)
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedNotifications = notifications.map(notification => {
      const notificationObj = notification.toObject();
      return {
        ...notificationObj,
        id: notificationObj._id,
        createdAt: notificationObj.createdAt
      };
    });
    
    res.json(transformedNotifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read (auth required)
router.put('/:id/read', auth, async (req, res) => {
  try {
    console.log('Marking notification as read:', { 
      notificationId: req.params.id, 
      userId: req.user.id 
    });
    
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      console.log('Notification not found');
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Transform the response to include id field
    const notificationObj = notification.toObject();
    const transformedNotification = {
      ...notificationObj,
      id: notificationObj._id,
      createdAt: notificationObj.createdAt
    };
    
    console.log('Notification marked as read:', transformedNotification);
    res.json(transformedNotification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 