const jwt = require('jsonwebtoken');

// Middleware function to check if user has valid token
const protect = (req, res, next) => {
  //
  // Get token from Authorization header
  const token = req.headers.authorization;

  // Return if no token
  if (!token) return res.status(401).send('Unauthorised');

  // Verify the token
  try {
    const tokenUser = jwt.verify(token, process.env.TOKEN_SECRET);
    // Add the user id to the request
    req.tokenUser = tokenUser;
  } catch (error) {
    // Return if malformed or invalid token
    return res.status(401).send('Invalid token');
  }

  // Valid token, next
  next();
};

// Middleware function to check if user has valid token, and is admin
const protectAdmin = (req, res, next) => {
  //
  // Get token from Authorization header
  const token = req.headers.authorization;

  // Return if no token
  if (!token) return res.status(401).send('Unauthorised');

  // Verify the token
  try {
    const tokenUser = jwt.verify(token, process.env.TOKEN_SECRET);
    // Add the user id to the request
    req.tokenUser = tokenUser;
  } catch (error) {
    // Return if malformed or invalid token
    return res.status(401).send('Invalid token');
  }

  // Valid token, next
  if (jwt.decode(token).role === 'admin') {
    next();
  } else {
    return res.status(401).send('Invalid privileges');
  }
};

module.exports = {
  protect, protectAdmin
};
