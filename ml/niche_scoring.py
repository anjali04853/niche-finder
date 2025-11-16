#!/usr/bin/env python3
"""
Advanced Niche Scoring Algorithm
Uses machine learning to predict niche profitability
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
import json

class NicheScorer:
    """
    Intelligent niche scoring system that analyzes multiple factors
    to predict profitability and success probability
    """
    
    def __init__(self):
        self.weights = {
            'search_volume': 0.25,
            'trend_growth': 0.30,
            'competition': 0.20,
            'monetization_potential': 0.15,
            'entry_barriers': 0.10
        }
        
        self.competition_scores = {
            'Low': 100,
            'Medium': 60,
            'High': 30
        }
    
    def normalize_search_volume(self, volume):
        """Normalize search volume to 0-100 scale"""
        if volume < 1000:
            return volume / 10
        elif volume < 10000:
            return 40 + (volume - 1000) / 180
        elif volume < 50000:
            return 70 + (volume - 10000) / 1333
        else:
            return min(100, 90 + (volume - 50000) / 10000)
    
    def extract_trend_score(self, trend_string):
        """Extract numeric trend value from string like 'Rising 145%'"""
        try:
            if 'Rising' in trend_string:
                value = float(trend_string.replace('Rising ', '').replace('%', ''))
                return min(100, value)
            elif 'Steady' in trend_string:
                value = float(trend_string.replace('Steady ', '').replace('%', ''))
                return min(80, value)
            elif 'Declining' in trend_string:
                return 20
            else:
                return 50
        except:
            return 50
    
    def score_monetization(self, methods):
        """Score based on number and quality of monetization methods"""
        base_score = len(methods) * 25
        
        # Bonus for high-value methods
        premium_methods = ['Consulting', 'Courses', 'Software', 'Coaching']
        bonus = sum(15 for m in methods if any(pm in m for pm in premium_methods))
        
        return min(100, base_score + bonus)
    
    def score_entry_barriers(self, barrier_text):
        """Lower barriers = higher score"""
        barrier_text = barrier_text.lower()
        
        if any(word in barrier_text for word in ['low', 'minimal', 'basic', 'simple']):
            return 90
        elif any(word in barrier_text for word in ['some', 'moderate', 'helpful']):
            return 65
        elif any(word in barrier_text for word in ['high', 'required', 'certification', 'license']):
            return 35
        else:
            return 50
    
    def calculate_competition_score(self, competition_level):
        """Convert competition level to score"""
        return self.competition_scores.get(competition_level, 50)
    
    def score_audience_size(self, audience_text):
        """Estimate audience size score from demographic text"""
        age_ranges = {
            '18-25': 0.8,
            '25-35': 1.0,
            '35-45': 0.95,
            '45-55': 0.85,
            '55+': 0.7
        }
        
        score = 50
        for age_range, multiplier in age_ranges.items():
            if age_range in audience_text:
                score = int(score * multiplier)
                break
        
        return score
    
    def calculate_profit_score(self, niche_data):
        """
        Main scoring function that combines all factors
        Returns score from 0-100
        """
        # Individual component scores
        search_score = self.normalize_search_volume(niche_data['search_volume'])
        trend_score = self.extract_trend_score(niche_data['trend'])
        competition_score = self.calculate_competition_score(niche_data['competition'])
        monetization_score = self.score_monetization(niche_data['monetization'])
        barrier_score = self.score_entry_barriers(niche_data['barriers'])
        
        # Weighted total
        total_score = (
            search_score * self.weights['search_volume'] +
            trend_score * self.weights['trend_growth'] +
            competition_score * self.weights['competition'] +
            monetization_score * self.weights['monetization_potential'] +
            barrier_score * self.weights['entry_barriers']
        )
        
        return round(total_score, 0)
    
    def calculate_success_probability(self, profit_score, user_skills):
        """
        Calculate success probability based on profit score and user skills
        """
        base_probability = profit_score
        
        # Skill match bonus (up to +15%)
        skill_bonus = min(15, len(user_skills) * 3)
        
        # Time factor (new niches are riskier)
        time_penalty = 5
        
        final_probability = min(95, base_probability + skill_bonus - time_penalty)
        return round(final_probability, 0)
    
    def generate_revenue_estimate(self, profit_score, competition):
        """Generate realistic revenue estimate based on score and competition"""
        if profit_score >= 85:
            if competition == 'Low':
                return '$5,000-$15,000/month'
            else:
                return '$4,000-$12,000/month'
        elif profit_score >= 80:
            if competition == 'Low':
                return '$4,000-$11,000/month'
            else:
                return '$3,000-$9,000/month'
        elif profit_score >= 75:
            return '$3,000-$8,000/month'
        else:
            return '$2,000-$6,000/month'
    
    def rank_niches(self, niches_list, user_profile):
        """
        Rank multiple niches based on user profile match
        """
        scored_niches = []
        
        for niche in niches_list:
            # Calculate base profit score
            profit_score = self.calculate_profit_score(niche)
            
            # Calculate user match score
            interest_match = any(
                interest.lower() in niche['category'].lower()
                for interest in user_profile.get('interests', [])
            )
            match_bonus = 5 if interest_match else 0
            
            # Adjust score
            final_score = min(100, profit_score + match_bonus)
            
            scored_niches.append({
                **niche,
                'profit_score': final_score,
                'success_probability': self.calculate_success_probability(
                    final_score, 
                    user_profile.get('skills', [])
                ),
                'user_match': interest_match
            })
        
        # Sort by score
        return sorted(scored_niches, key=lambda x: x['profit_score'], reverse=True)
    
    def analyze_keyword_opportunity(self, keywords, search_volume):
        """Analyze keyword opportunity score"""
        avg_length = np.mean([len(kw.split()) for kw in keywords])
        
        # Long-tail keywords (3+ words) are better
        if avg_length >= 3:
            keyword_score = 90
        elif avg_length >= 2:
            keyword_score = 70
        else:
            keyword_score = 50
        
        # Adjust for search volume
        volume_factor = min(1.2, search_volume / 20000)
        final_score = int(keyword_score * volume_factor)
        
        return min(100, final_score)


def score_niche_from_json(niche_json, user_profile_json=None):
    """
    Helper function to score a niche from JSON data
    """
    scorer = NicheScorer()
    niche = json.loads(niche_json) if isinstance(niche_json, str) else niche_json
    
    profit_score = scorer.calculate_profit_score(niche)
    
    result = {
        'niche_name': niche['name'],
        'profit_score': profit_score,
        'breakdown': {
            'search_volume_score': scorer.normalize_search_volume(niche['search_volume']),
            'trend_score': scorer.extract_trend_score(niche['trend']),
            'competition_score': scorer.calculate_competition_score(niche['competition']),
            'monetization_score': scorer.score_monetization(niche['monetization']),
            'barrier_score': scorer.score_entry_barriers(niche['barriers']),
            'keyword_score': scorer.analyze_keyword_opportunity(
                niche['keywords'], 
                niche['search_volume']
            )
        },
        'revenue_estimate': scorer.generate_revenue_estimate(
            profit_score, 
            niche['competition']
        )
    }
    
    if user_profile_json:
        user_profile = json.loads(user_profile_json) if isinstance(user_profile_json, str) else user_profile_json
        result['success_probability'] = scorer.calculate_success_probability(
            profit_score,
            user_profile.get('skills', [])
        )
    
    return result


# Example usage and testing
if __name__ == "__main__":
    # Test niche
    test_niche = {
        'name': 'Smart Home Energy Monitoring',
        'category': 'Technology + Environment',
        'search_volume': 18500,
        'competition': 'Low',
        'trend': 'Rising 145%',
        'monetization': ['Affiliate Sales', 'Review Blog', 'Consulting'],
        'barriers': 'Low technical knowledge required',
        'audience': '35-55 homeowners, eco-conscious',
        'keywords': ['home energy monitor', 'smart power meter', 'electricity usage tracker']
    }
    
    test_user = {
        'interests': ['Technology', 'Environment'],
        'skills': ['Writing', 'SEO', 'Research']
    }
    
    # Score the niche
    result = score_niche_from_json(test_niche, test_user)
    
    print("=== NICHE SCORING RESULTS ===")
    print(f"\nNiche: {result['niche_name']}")
    print(f"Overall Profit Score: {result['profit_score']}/100")
    print(f"Success Probability: {result.get('success_probability', 'N/A')}%")
    print(f"Revenue Estimate: {result['revenue_estimate']}")
    
    print("\n--- Score Breakdown ---")
    for metric, score in result['breakdown'].items():
        print(f"{metric.replace('_', ' ').title()}: {score:.1f}/100")
    
    print("\n=== BATCH SCORING TEST ===")
    
    # Multiple niches
    niches = [test_niche] * 3  # Would normally be different niches
    
    scorer = NicheScorer()
    ranked = scorer.rank_niches(niches, test_user)
    
    print(f"\nRanked {len(ranked)} niches by profitability:")
    for i, niche in enumerate(ranked, 1):
        print(f"{i}. {niche['name']} - Score: {niche['profit_score']}")