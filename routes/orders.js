const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = 'thosanbanhtrang_secret_key_123';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create an order
router.post('/', authMiddleware, (req, res) => {
  const { items, totalAmount, shippingAddress, notes } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const orders = db.getOrders();
  const newOrder = {
    id: 'ord_' + Date.now(),
    userId: req.user.id,
    items,
    totalAmount,
    shippingAddress,
    notes,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  db.saveOrders(orders);

  // Add reward points (e.g. 5% of total amount)
  const users = db.getUsers();
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) {
    const pointsEarned = Math.floor(totalAmount * 0.05);
    users[userIndex].points = (users[userIndex].points || 0) + pointsEarned;
    db.saveUsers(users);
  }

  res.json({ message: 'Order created successfully', order: newOrder });
});

// Get user's orders
router.get('/', authMiddleware, (req, res) => {
  const orders = db.getOrders();
  const userOrders = orders.filter(o => o.userId === req.user.id).reverse();
  res.json(userOrders);
});

module.exports = router;
