const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  console.log('Auth middleware:', { 
    method: req.method, 
    path: req.path, 
    hasAuthHeader: !!req.headers.authorization 
  });
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No valid auth header');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Auth successful for user:', req.user.id);
    next();
  } catch (err) {
    console.log('Auth failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth; 