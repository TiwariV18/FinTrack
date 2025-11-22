const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserInfo } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserInfo);

module.exports = router;
