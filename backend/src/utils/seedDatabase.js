/**
 * Database Seed Script & Testing Utilities
 * Complete data for 10 validated niches + test helpers
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Niche Model Schema
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

const Niche = mongoose.model('Niche', nicheSchema);

// Complete 10 Validated Niches with Full Data
const validatedNiches = [
  {
    name: 'Smart Home Energy Monitoring',
    category: 'Technology + Environment',
    searchVolume: 18500,
    competition: 'Low',
    profitScore: 87,
    trend: 'Rising 145%',
    monetization: ['Affiliate Sales', 'Review Blog', 'Consulting'],
    barriers: 'Low technical knowledge required',
    audience: '35-55 homeowners, eco-conscious',
    revenue: '$3,000-$8,000/month',
    keywords: ['home energy monitor', 'smart power meter', 'electricity usage tracker']
  },
  {
    name: 'Plant-Based Meal Prep for Athletes',
    category: 'Health & Fitness + Food',
    searchVolume: 22300,
    competition: 'Medium',
    profitScore: 82,
    trend: 'Rising 98%',
    monetization: ['Recipe eBooks', 'Meal Plans', 'Coaching'],
    barriers: 'Nutrition certification helpful',
    audience: '25-40 fitness enthusiasts',
    revenue: '$4,000-$12,000/month',
    keywords: ['vegan meal prep bodybuilding', 'plant protein athlete', 'vegetarian sports nutrition']
  },
  {
    name: 'Remote Work Productivity Tools',
    category: 'Technology + Education',
    searchVolume: 31200,
    competition: 'Medium',
    profitScore: 85,
    trend: 'Steady 67%',
    monetization: ['Tool Reviews', 'Courses', 'Affiliate'],
    barriers: 'Remote work experience needed',
    audience: '28-45 remote professionals',
    revenue: '$5,000-$15,000/month',
    keywords: ['remote work setup', 'home office productivity', 'virtual team tools']
  },
  {
    name: 'Budget Travel for Digital Nomads',
    category: 'Travel + Personal Finance',
    searchVolume: 27800,
    competition: 'Medium',
    profitScore: 79,
    trend: 'Rising 112%',
    monetization: ['Travel Guides', 'Affiliate Hotels', 'Consulting'],
    barriers: 'Travel experience required',
    audience: '25-40 location-independent workers',
    revenue: '$3,500-$10,000/month',
    keywords: ['cheap countries digital nomad', 'budget remote work travel', 'affordable nomad destinations']
  },
  {
    name: 'Pet Anxiety Solutions',
    category: 'Pets + Health',
    searchVolume: 24600,
    competition: 'Low',
    profitScore: 88,
    trend: 'Rising 134%',
    monetization: ['Product Reviews', 'Training Guides', 'Affiliate'],
    barriers: 'Pet behavior knowledge helpful',
    audience: '30-55 pet owners',
    revenue: '$4,000-$11,000/month',
    keywords: ['dog separation anxiety products', 'cat stress relief', 'pet calming solutions']
  },
  {
    name: 'Sustainable Fashion on a Budget',
    category: 'Fashion + Environment',
    searchVolume: 19400,
    competition: 'Low',
    profitScore: 81,
    trend: 'Rising 156%',
    monetization: ['Style Guides', 'Curated Collections', 'Affiliate'],
    barriers: 'Fashion sense required',
    audience: '20-35 eco-conscious shoppers',
    revenue: '$2,500-$8,000/month',
    keywords: ['affordable sustainable clothing', 'budget eco fashion', 'cheap ethical brands']
  },
  {
    name: 'DIY Smart Garden Systems',
    category: 'DIY + Technology',
    searchVolume: 16700,
    competition: 'Low',
    profitScore: 84,
    trend: 'Rising 189%',
    monetization: ['Tutorial Videos', 'Component Kits', 'eBooks'],
    barriers: 'Basic electronics knowledge',
    audience: '30-50 tech-savvy gardeners',
    revenue: '$3,000-$9,000/month',
    keywords: ['automated garden system', 'smart irrigation diy', 'raspberry pi garden']
  },
  {
    name: 'Minimalist Financial Planning',
    category: 'Personal Finance + Lifestyle',
    searchVolume: 21900,
    competition: 'Medium',
    profitScore: 80,
    trend: 'Rising 91%',
    monetization: ['Budgeting Templates', 'Coaching', 'Courses'],
    barriers: 'Financial literacy needed',
    audience: '25-40 simplicity seekers',
    revenue: '$4,500-$13,000/month',
    keywords: ['minimalist budget', 'simple financial planning', 'frugal money management']
  },
  {
    name: 'Senior Tech Support Tutorials',
    category: 'Education + Technology',
    searchVolume: 28300,
    competition: 'Low',
    profitScore: 86,
    trend: 'Rising 143%',
    monetization: ['Video Courses', 'In-Person Services', 'eBooks'],
    barriers: 'Patience and teaching skills',
    audience: '60+ seniors and their families',
    revenue: '$3,500-$10,000/month',
    keywords: ['tech help for seniors', 'smartphone tutorial elderly', 'computer basics older adults']
  },
  {
    name: 'Urban Apartment Composting',
    category: 'Environment + Home Improvement',
    searchVolume: 14200,
    competition: 'Low',
    profitScore: 83,
    trend: 'Rising 201%',
    monetization: ['Starter Kits', 'Video Guides', 'Consulting'],
    barriers: 'Composting knowledge required',
    audience: '25-45 urban environmentalists',
    revenue: '$2,000-$7,000/month',
    keywords: ['apartment composting solutions', 'indoor compost bin', 'small space composting']
  }
];

// Database Seed Function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/niche-finder', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Niche.deleteMany({});
    console.log('✓ Cleared existing niches');

    // Insert validated niches
    const inserted = await Niche.insertMany(validatedNiches);
    console.log(`✓ Seeded ${inserted.length} validated niches`);

    // Verify data
    const count = await Niche.countDocuments();
    console.log(`✓ Total niches in database: ${count}`);

    // Display summary
    console.log('\n=== DATABASE SEED COMPLETE ===');
    console.log('Niches by category:');
    
    const categories = {};
    inserted.forEach(niche => {
      const cat = niche.category;
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    console.log('\nAverage profit score:', 
      (inserted.reduce((sum, n) => sum + n.profitScore, 0) / inserted.length).toFixed(1)
    );

    console.log('\nCompetition breakdown:');
    const competition = {};
    inserted.forEach(niche => {
      const comp = niche.competition;
      competition[comp] = (competition[comp] || 0) + 1;
    });
    Object.entries(competition).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    
  } catch (error) {
    console.error('✗ Seed error:', error);
    process.exit(1);
  }
}

// Test Utilities
class DatabaseTestUtils {
  
  static async connectTest() {
    try {
      await mongoose.connect(
        process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/niche-finder-test',
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      return true;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }

  static async clearTestData() {
    await Niche.deleteMany({});
  }

  static async createTestNiche(overrides = {}) {
    const defaultNiche = {
      name: 'Test Niche',
      category: 'Test Category',
      searchVolume: 10000,
      competition: 'Low',
      profitScore: 75,
      trend: 'Rising 50%',
      monetization: ['Test Method'],
      barriers: 'Low',
      audience: 'Test Audience',
      revenue: '$1,000-$5,000/month',
      keywords: ['test keyword']
    };

    return await Niche.create({ ...defaultNiche, ...overrides });
  }

  static async runTests() {
    console.log('Running database tests...\n');
    
    const tests = [
      { name: 'Create Niche', fn: this.testCreate },
      { name: 'Read Niches', fn: this.testRead },
      { name: 'Update Niche', fn: this.testUpdate },
      { name: 'Delete Niche', fn: this.testDelete },
      { name: 'Search by Category', fn: this.testSearch },
      { name: 'Filter by Score', fn: this.testFilter }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        await test.fn.call(this);
        console.log(`✓ ${test.name}`);
        passed++;
      } catch (error) {
        console.log(`✗ ${test.name}: ${error.message}`);
        failed++;
      }
    }

    console.log(`\nTests: ${passed} passed, ${failed} failed`);
    return failed === 0;
  }

  static async testCreate() {
    const niche = await this.createTestNiche({ name: 'Test Create Niche' });
    if (!niche._id) throw new Error('Niche not created');
  }

  static async testRead() {
    await this.createTestNiche({ name: 'Test Read Niche' });
    const niches = await Niche.find();
    if (niches.length === 0) throw new Error('No niches found');
  }

  static async testUpdate() {
    const niche = await this.createTestNiche({ name: 'Test Update Niche' });
    niche.profitScore = 90;
    await niche.save();
    const updated = await Niche.findById(niche._id);
    if (updated.profitScore !== 90) throw new Error('Niche not updated');
  }

  static async testDelete() {
    const niche = await this.createTestNiche({ name: 'Test Delete Niche' });
    await Niche.findByIdAndDelete(niche._id);
    const deleted = await Niche.findById(niche._id);
    if (deleted) throw new Error('Niche not deleted');
  }

  static async testSearch() {
    await this.createTestNiche({ 
      name: 'Tech Niche', 
      category: 'Technology + Test' 
    });
    const results = await Niche.find({ 
      category: { $regex: 'Technology', $options: 'i' } 
    });
    if (results.length === 0) throw new Error('Search failed');
  }

  static async testFilter() {
    await this.createTestNiche({ name: 'High Score Niche', profitScore: 95 });
    const results = await Niche.find({ profitScore: { $gte: 90 } });
    if (results.length === 0) throw new Error('Filter failed');
  }
}

// Performance Test
async function performanceTest() {
  console.log('Running performance tests...\n');
  
  const tests = [
    { name: 'Insert 100 niches', operation: 'insert', count: 100 },
    { name: 'Query 1000 times', operation: 'query', count: 1000 },
    { name: 'Update 50 niches', operation: 'update', count: 50 }
  ];

  for (const test of tests) {
    const start = Date.now();
    
    switch (test.operation) {
      case 'insert':
        const bulkNiches = [];
        for (let i = 0; i < test.count; i++) {
          bulkNiches.push({
            ...validatedNiches[0],
            name: `Test Niche ${i}`,
            _id: new mongoose.Types.ObjectId()
          });
        }
        await Niche.insertMany(bulkNiches);
        break;
        
      case 'query':
        for (let i = 0; i < test.count; i++) {
          await Niche.find().limit(10);
        }
        break;
        
      case 'update':
        const nichesToUpdate = await Niche.find().limit(test.count);
        for (const niche of nichesToUpdate) {
          niche.profitScore += 1;
          await niche.save();
        }
        break;
    }
    
    const duration = Date.now() - start;
    const avgTime = (duration / test.count).toFixed(2);
    console.log(`✓ ${test.name}: ${duration}ms total (${avgTime}ms avg)`);
  }
}

// Data Validation
function validateNicheData(niche) {
  const errors = [];

  if (!niche.name || niche.name.length < 3) {
    errors.push('Name must be at least 3 characters');
  }

  if (!niche.searchVolume || niche.searchVolume < 0) {
    errors.push('Search volume must be positive');
  }

  if (!['Low', 'Medium', 'High'].includes(niche.competition)) {
    errors.push('Competition must be Low, Medium, or High');
  }

  if (!niche.profitScore || niche.profitScore < 0 || niche.profitScore > 100) {
    errors.push('Profit score must be between 0 and 100');
  }

  if (!niche.keywords || niche.keywords.length === 0) {
    errors.push('At least one keyword is required');
  }

  if (!niche.monetization || niche.monetization.length === 0) {
    errors.push('At least one monetization method required');
  }

  return errors;
}

// Export Statistics
async function exportStatistics() {
  const niches = await Niche.find();
  
  const stats = {
    total: niches.length,
    avgSearchVolume: niches.reduce((sum, n) => sum + n.searchVolume, 0) / niches.length,
    avgProfitScore: niches.reduce((sum, n) => sum + n.profitScore, 0) / niches.length,
    competition: {
      Low: niches.filter(n => n.competition === 'Low').length,
      Medium: niches.filter(n => n.competition === 'Medium').length,
      High: niches.filter(n => n.competition === 'High').length
    },
    categories: {},
    trends: {
      rising: niches.filter(n => n.trend.includes('Rising')).length,
      steady: niches.filter(n => n.trend.includes('Steady')).length,
      declining: niches.filter(n => n.trend.includes('Declining')).length
    }
  };

  niches.forEach(niche => {
    stats.categories[niche.category] = (stats.categories[niche.category] || 0) + 1;
  });

  return stats;
}

// Command Line Interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'seed':
      seedDatabase().then(() => process.exit(0));
      break;
      
    case 'test':
      (async () => {
        await DatabaseTestUtils.connectTest();
        await DatabaseTestUtils.clearTestData();
        const success = await DatabaseTestUtils.runTests();
        await mongoose.connection.close();
        process.exit(success ? 0 : 1);
      })();
      break;
      
    case 'perf':
      (async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/niche-finder');
        await performanceTest();
        await mongoose.connection.close();
        process.exit(0);
      })();
      break;
      
    case 'stats':
      (async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/niche-finder');
        const stats = await exportStatistics();
        console.log(JSON.stringify(stats, null, 2));
        await mongoose.connection.close();
        process.exit(0);
      })();
      break;
      
    default:
      console.log('Usage: node seedDatabase.js [command]');
      console.log('Commands:');
      console.log('  seed  - Seed database with validated niches');
      console.log('  test  - Run database tests');
      console.log('  perf  - Run performance tests');
      console.log('  stats - Export database statistics');
      process.exit(1);
  }
}

module.exports = {
  seedDatabase,
  validatedNiches,
  DatabaseTestUtils,
  validateNicheData,
  exportStatistics,
  Niche
};