const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST request to register
router.post('/register', authController.register);

// POST request to login
router.post('/login', authController.login);

module.exports = router;