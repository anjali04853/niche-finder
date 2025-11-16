const mongoose = require('mongoose');

const nicheSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: String,
  searchVolume: Number,
  competition: String,
  profitScore: Number,
  trend: String,
  monetization: [String],
  barriers: String,
  audience: String,
  revenue: String,
  keywords: [String],
  validated: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Niche', nicheSchema);