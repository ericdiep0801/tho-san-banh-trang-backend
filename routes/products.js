const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all products + Search
router.get('/', (req, res) => {
  const { search } = req.query;
  let products = db.getProducts();

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.json(products);
});

// Get product by id
router.get('/:id', (req, res) => {
  const products = db.getProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

module.exports = router;
