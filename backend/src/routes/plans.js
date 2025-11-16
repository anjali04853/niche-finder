const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { niche } = req.body;
    
    const plan = {
      niche: niche.name,
      contentStrategy: {
        phase1: [
          `Create 10 foundational blog posts about ${niche.name}`,
          'Develop 3 comprehensive guides',
          'Build email list'
        ],
        phase2: [
          'Launch weekly content schedule',
          'Create video tutorials',
          'Guest post on 5 blogs'
        ],
        phase3: [
          'Develop premium content',
          'Build email sequences',
          'Expand to social media'
        ]
      },
      revenueProjections: {
        month3: '$500-$1,000',
        month6: '$1,500-$3,000',
        month12: niche.revenue
      },
      successProbability: `${niche.profitScore}%`
    };
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;