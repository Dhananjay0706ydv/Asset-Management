const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Grab the token from the headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Access Denied: No Token Provided!' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the user info (id, role) to the request
    next(); // Let them pass to the next step
  } catch (error) {
    res.status(403).json({ status: 'error', message: 'Invalid or Expired Token' });
  }
};

module.exports = { verifyToken };