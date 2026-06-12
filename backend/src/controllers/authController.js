const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Removed 'name'

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Save to database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: password_hash, // <-- FIXED: Maps the hash to the correct database column
        role: role || 'ADMIN',   // <-- Defaulted to ADMIN so you have full website access
      },
    });

    res.status(201).json({ status: 'success', message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error during registration' });
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // 2. Check if password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.password); // <-- FIXED: Looks at user.password
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // 3. Generate a JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(200).json({ 
      status: 'success', 
      message: 'Logged in successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role } // Removed 'name'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Server error during login' });
  }
};

module.exports = { register, login };