const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    // Check if user exists and has admin role
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Check if user is not suspended or banned
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is suspended or banned' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = admin; 