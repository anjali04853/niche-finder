/**
 * API Integration Service for Google Trends Niche Finder
 * Handles all external API calls with caching and error handling
 */

const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class APIIntegrationService {
  constructor() {
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
    this.rapidApiHost = 'google-trends2.p.rapidapi.com';
  }

  /**
   * Get Google Trends data for a keyword
   */
  async getGoogleTrends(keyword, timeRange = 'today 12-m') {
    const cacheKey = `trends_${keyword}_${timeRange}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log(`Cache hit for: ${keyword}`);
      return cached;
    }

    try {
      const response = await axios({
        method: 'GET',
        url: `https://${this.rapidApiHost}/trends/interest-over-time`,
        params: {
          keyword: keyword,
          geo: 'US',
          time: timeRange
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost
        }
      });

      const data = response.data;
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching trends for ${keyword}:`, error.message);
      return this.getMockTrendsData(keyword);
    }
  }

  /**
   * Get related queries for a keyword
   */
  async getRelatedQueries(keyword) {
    const cacheKey = `related_${keyword}`;
    const cached = cache.get(cacheKey);
    
    if (cached) return cached;

    try {
      const response = await axios({
        method: 'GET',
        url: `https://${this.rapidApiHost}/trends/related-queries`,
        params: {
          keyword: keyword,
          geo: 'US'
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': this.rapidApiHost
        }
      });

      const data = response.data;
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching related queries for ${keyword}:`, error.message);
      return this.getMockRelatedQueries(keyword);
    }
  }

  /**
   * Analyze trend trajectory
   */
  analyzeTrendTrajectory(trendData) {
    if (!trendData || !trendData.values) {
      return { status: 'Unknown', growth: 0 };
    }

    const values = trendData.values.map(v => v.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const growth = ((avgSecond - avgFirst) / avgFirst) * 100;

    let status;
    if (growth > 50) status = 'Rising';
    else if (growth > 10) status = 'Steady';
    else if (growth > -10) status = 'Stable';
    else status = 'Declining';

    return { status, growth: Math.round(growth) };
  }

  /**
   * Estimate search volume from trends data
   */
  estimateSearchVolume(trendData, baselineVolume = 1000) {
    if (!trendData || !trendData.values) {
      return baselineVolume;
    }

    const avgTrendValue = trendData.values.reduce((sum, v) => sum + v.value, 0) / trendData.values.length;
    const multiplier = avgTrendValue / 50; // Normalize around 50
    
    return Math.round(baselineVolume * multiplier);
  }

  /**
   * Check domain availability (mock - would integrate with domain API)
   */
  async checkDomainAvailability(domainName) {
    const cacheKey = `domain_${domainName}`;
    const cached = cache.get(cacheKey);
    
    if (cached !== undefined) return cached;

    try {
      // In production, integrate with Namecheap, GoDaddy, or similar API
      // For now, return mock data
      const available = Math.random() > 0.5;
      cache.set(cacheKey, available, 86400); // Cache for 24 hours
      return available;
    } catch (error) {
      console.error(`Error checking domain: ${domainName}`, error.message);
      return false;
    }
  }

  /**
   * Find affiliate programs for a niche
   */
  async findAffiliatePrograms(nicheCategory) {
    const affiliateDatabase = {
      'Technology': [
        { name: 'Amazon Associates', commission: '1-10%', url: 'https://affiliate-program.amazon.com' },
        { name: 'Best Buy Affiliate', commission: '1-4%', url: 'https://www.bestbuy.com/affiliate' },
        { name: 'Newegg', commission: '2-5%', url: 'https://www.newegg.com/affiliates' }
      ],
      'Health & Fitness': [
        { name: 'iHerb', commission: '5-10%', url: 'https://www.iherb.com/affiliates' },
        { name: 'MyProtein', commission: '8-12%', url: 'https://www.myprotein.com/affiliates' },
        { name: 'Bodybuilding.com', commission: '5-15%', url: 'https://www.bodybuilding.com/affiliates' }
      ],
      'Travel': [
        { name: 'Booking.com', commission: '25-40%', url: 'https://www.booking.com/affiliate' },
        { name: 'Expedia', commission: '2-7%', url: 'https://www.expedia.com/affiliates' },
        { name: 'Airbnb', commission: '$25-200/booking', url: 'https://www.airbnb.com/associates' }
      ],
      'Fashion': [
        { name: 'ASOS', commission: '5-10%', url: 'https://www.asos.com/affiliates' },
        { name: 'Nordstrom', commission: '2-5%', url: 'https://www.nordstrom.com/affiliates' },
        { name: 'Zappos', commission: '7-15%', url: 'https://www.zappos.com/affiliates' }
      ],
      'Education': [
        { name: 'Udemy', commission: '15-50%', url: 'https://www.udemy.com/affiliate' },
        { name: 'Coursera', commission: '10-45%', url: 'https://www.coursera.org/affiliate' },
        { name: 'Skillshare', commission: '$10/sale', url: 'https://www.skillshare.com/affiliate' }
      ],
      'Home': [
        { name: 'Wayfair', commission: '5-10%', url: 'https://www.wayfair.com/affiliate' },
        { name: 'Home Depot', commission: '3-8%', url: 'https://www.homedepot.com/affiliate' },
        { name: 'Overstock', commission: '5-12%', url: 'https://www.overstock.com/affiliate' }
      ],
      'Pets': [
        { name: 'Chewy', commission: '4-8%', url: 'https://www.chewy.com/affiliates' },
        { name: 'Petco', commission: '3-7%', url: 'https://www.petco.com/affiliates' },
        { name: 'PetSmart', commission: '2-5%', url: 'https://www.petsmart.com/affiliates' }
      ]
    };

    // Match category to affiliate programs
    const matchedPrograms = [];
    for (const [category, programs] of Object.entries(affiliateDatabase)) {
      if (nicheCategory.toLowerCase().includes(category.toLowerCase())) {
        matchedPrograms.push(...programs);
      }
    }

    // Add general programs if no specific match
    if (matchedPrograms.length === 0) {
      matchedPrograms.push(
        { name: 'Amazon Associates', commission: '1-10%', url: 'https://affiliate-program.amazon.com' },
        { name: 'ShareASale', commission: 'Varies', url: 'https://www.shareasale.com' },
        { name: 'CJ Affiliate', commission: 'Varies', url: 'https://www.cj.com' }
      );
    }

    return matchedPrograms.slice(0, 5);
  }

  /**
   * Generate social media handles
   */
  generateSocialHandles(nicheName) {
    const cleanName = nicheName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '');
    
    return {
      twitter: [`@${cleanName}`, `@${cleanName}hq`, `@the${cleanName}`],
      instagram: [`@${cleanName}`, `@${cleanName}.official`, `@${cleanName}.hub`],
      youtube: [`${cleanName}`, `${cleanName}TV`, `The ${nicheName} Channel`],
      tiktok: [`@${cleanName}`, `@${cleanName}tips`, `@${cleanName}daily`]
    };
  }

  /**
   * Analyze competition level
   */
  async analyzeCompetition(keywords) {
    // In production, this would use SEMrush, Ahrefs, or Moz API
    // For now, return mock analysis
    
    const avgKeywordLength = keywords.reduce((sum, kw) => sum + kw.split(' ').length, 0) / keywords.length;
    
    let competitionLevel;
    if (avgKeywordLength >= 4) {
      competitionLevel = 'Low'; // Long-tail keywords
    } else if (avgKeywordLength >= 2.5) {
      competitionLevel = 'Medium';
    } else {
      competitionLevel = 'High'; // Short keywords
    }

    return {
      level: competitionLevel,
      avgKeywordLength: avgKeywordLength.toFixed(1),
      recommendation: avgKeywordLength >= 3 
        ? 'Good keyword strategy - focus on these long-tail terms'
        : 'Consider targeting longer, more specific keywords'
    };
  }

  /**
   * Find course topics for a niche
   */
  generateCourseTopics(nicheName, keywords) {
    const templates = [
      `Complete ${nicheName} Guide for Beginners`,
      `Advanced ${nicheName} Strategies`,
      `${nicheName}: Zero to Expert in 30 Days`,
      `Mastering ${keywords[0] || nicheName}`,
      `The ${nicheName} Blueprint`,
      `${nicheName} Bootcamp`,
      `From Beginner to Pro: ${nicheName}`,
      `Ultimate ${nicheName} Masterclass`
    ];

    return templates.slice(0, 5);
  }

  /**
   * Mock data generators for fallback
   */
  getMockTrendsData(keyword) {
    const values = [];
    let baseValue = 40 + Math.random() * 30;
    
    for (let i = 0; i < 12; i++) {
      baseValue += (Math.random() - 0.4) * 10;
      baseValue = Math.max(20, Math.min(100, baseValue));
      
      values.push({
        time: `2024-${String(i + 1).padStart(2, '0')}`,
        value: Math.round(baseValue)
      });
    }

    return { keyword, values };
  }

  getMockRelatedQueries(keyword) {
    return {
      rising: [
        { query: `${keyword} guide`, value: '+250%' },
        { query: `best ${keyword}`, value: '+180%' },
        { query: `${keyword} tips`, value: '+150%' }
      ],
      top: [
        { query: `${keyword} tutorial`, value: 100 },
        { query: `how to ${keyword}`, value: 85 },
        { query: `${keyword} review`, value: 70 }
      ]
    };
  }

  /**
   * Comprehensive niche analysis
   */
  async analyzeNiche(nicheData) {
    try {
      const [
        trendsData,
        relatedQueries,
        competition,
        affiliatePrograms,
        socialHandles,
        courseTopics
      ] = await Promise.all([
        this.getGoogleTrends(nicheData.name),
        this.getRelatedQueries(nicheData.name),
        this.analyzeCompetition(nicheData.keywords),
        this.findAffiliatePrograms(nicheData.category),
        Promise.resolve(this.generateSocialHandles(nicheData.name)),
        Promise.resolve(this.generateCourseTopics(nicheData.name, nicheData.keywords))
      ]);

      const trajectory = this.analyzeTrendTrajectory(trendsData);
      const estimatedVolume = this.estimateSearchVolume(trendsData, nicheData.searchVolume);

      return {
        niche: nicheData.name,
        analysis: {
          trends: {
            trajectory: trajectory.status,
            growth: `${trajectory.growth}%`,
            data: trendsData.values
          },
          keywords: {
            primary: nicheData.keywords,
            related: relatedQueries.rising?.slice(0, 5) || [],
            competition: competition
          },
          monetization: {
            methods: nicheData.monetization,
            affiliatePrograms: affiliatePrograms
          },
          marketing: {
            socialHandles: socialHandles,
            courseTopics: courseTopics
          },
          metrics: {
            searchVolume: estimatedVolume,
            profitScore: nicheData.profitScore,
            competition: nicheData.competition
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in comprehensive analysis:', error);
      throw error;
    }
  }

  /**
   * Batch analyze multiple niches
   */
  async batchAnalyze(niches) {
    const results = [];
    
    for (const niche of niches) {
      try {
        const analysis = await this.analyzeNiche(niche);
        results.push(analysis);
        
        // Rate limiting - wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error analyzing ${niche.name}:`, error.message);
        results.push({ niche: niche.name, error: error.message });
      }
    }

    return results;
  }

  /**
   * Clear cache for testing
   */
  clearCache() {
    cache.flushAll();
    console.log('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }
}

// Export singleton instance
module.exports = new APIIntegrationService();

// Export class for testing
module.exports.APIIntegrationService = APIIntegrationService;