const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = 'thosanbanhtrang_secret_key_123';

// Mock OTP generation
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  
  // In a real app, integrate Firebase Admin SDK here
  // For now, we mock an OTP
  res.json({ message: 'OTP sent to ' + phone, mockOtp: '123456' });
});

// Verify OTP & Login/Register
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') return res.status(400).json({ error: 'Invalid OTP' });

  const users = db.getUsers();
  let user = users.find(u => u.phone === phone);
  
  if (!user) {
    user = { id: 'u_' + Date.now(), phone, points: 0, createdAt: new Date().toISOString() };
    users.push(user);
    db.saveUsers(users);
  }

  const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// Get Profile
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = db.getUsers();
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
