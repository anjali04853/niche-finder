const express = require('express');
const router = express.Router();
const Niche = require('../models/Niche');

// Get all niches
router.get('/', async (req, res) => {
  try {
    const niches = await Niche.find();
    res.json(niches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search niches based on user profile
router.post('/search', async (req, res) => {
  try {
    const { interests, skills, budget } = req.body;
    const query = {};
    
    if (interests && interests.length > 0) {
      query.category = { $regex: interests.join('|'), $options: 'i' };
    }
    
    const niches = await Niche.find(query).sort({ profitScore: -1 }).limit(5);
    res.json(niches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;