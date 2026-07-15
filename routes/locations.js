const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/locations
router.get('/', async (req, res) => {
  try {
    const locations = await db.knex('locations').select('*');
    // Knex might return images as string if not mapped correctly, parse if needed
    const mapped = locations.map(loc => {
      try {
        loc.images = typeof loc.images === 'string' ? JSON.parse(loc.images) : loc.images;
      } catch (e) {
        loc.images = [];
      }
      return loc;
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// POST /api/locations
router.post('/', async (req, res) => {
  try {
    const newLocation = req.body;

    // Basic validation
    if (!newLocation.name || !newLocation.lat || !newLocation.lng || !newLocation.address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Determine max ID (if IDs are integers stored as strings)
    const locations = await db.knex('locations').select('id');
    const maxId = locations.length > 0 ? Math.max(...locations.map(l => parseInt(l.id) || 0)) : 0;
    newLocation.id = (maxId + 1).toString();
    
    if (!newLocation.rating) newLocation.rating = 0;
    if (!newLocation.images) newLocation.images = [];
    
    const dbLocation = {
      ...newLocation,
      images: JSON.stringify(newLocation.images)
    };

    await db.knex('locations').insert(dbLocation);

    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
