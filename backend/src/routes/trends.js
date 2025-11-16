const express = require('express');
const router = express.Router();
const apiService = require('../services/apiIntegration');

router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const data = await apiService.getGoogleTrends(keyword);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;