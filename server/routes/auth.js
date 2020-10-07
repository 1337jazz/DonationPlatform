const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserForRegister = require('../models/UserForRegister');

// POST /api/auth/register
router.post('/register', async (req, res) => {
//
  // Create the user from the request body
  const userToRegister = new UserForRegister(req.body);

  // Check the admin key
  if (userToRegister.adminkey !== process.env.ADMIN_KEY) {
    return res.status(401).send('Invalid admin key');
  }

  // Check valid role type
  if (userToRegister.role !== 'user' && userToRegister.role !== 'admin') {
    return res.status(401).send('Invalid role type');
  }

  // Ensure username is not already in use
  const userExists = await User.findOne({
    username: userToRegister.username
  });
  if (userExists) return res.status(401).send('Already registered');

  // Do validation checks (for pre-hash password)
  const errors = userToRegister.validateSync();
  if (errors) {
    return res.status(200).send('Password too short');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);

  // Create the user
  const userToCreate = new User({
    username: userToRegister.username,
    password: passwordHash,
    role: userToRegister.role
  });

  // Save the user
  userToCreate.save().then(() => {
    console.log('New user registered');
    res.status(201).send('User created');
  }).catch((err) => {
    res.status(400).json({
      err,
    });
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // Find the user
  const user = await User.findOne({
    username: req.body.username
  });

  // Check if the user exists
  if (!user) return res.status(400).send('Invalid user');

  // Compare passwords
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send('Invalid password or username');

  // Create JWT
  const token = jwt.sign({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }, process.env.TOKEN_SECRET, {
    expiresIn: '24h'
  });
  res.status(200).json({
    token
  });
});

module.exports = router;
