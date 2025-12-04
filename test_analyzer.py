import json
from datetime import datetime, timedelta

class TestAnalyzer:
    def __init__(self):
        self.cognitive_domains = {
            'Pattern Recognition': ['color_sequence', 'simple_pattern', 'complete_sequence'],
            'Matrix Reasoning': ['matrix_logic', 'complex_matrix', 'missing_piece'],
            'Verbal Analogy': ['analogical_reasoning'],
            'Sequential Reasoning': ['series_completion', 'rotation_pattern'],
            'Abstract Reasoning': ['abstract_reasoning', 'rule_based', 'logical_deduction'],
            'Spatial Reasoning': ['spatial_rotation', 'shape_size']
        }
    
    def analyze_results(self, answers, questions):
        """Analyze test results to identify strengths and weaknesses"""
        category_stats = {}
        domain_stats = {}
        
        # Initialize statistics
        for category in self.cognitive_domains:
            domain_stats[category] = {'total': 0, 'correct': 0, 'accuracy': 0}
        
        # Process each answer
        for i, answer in enumerate(answers):
            question = questions[i]
            category = answer.get('category', 'Unknown')
            is_correct = self._is_answer_correct(answer, question)
            
            # Update category stats
            if category not in category_stats:
                category_stats[category] = {'total': 0, 'correct': 0}
            category_stats[category]['total'] += 1
            if is_correct:
                category_stats[category]['correct'] += 1
            
            # Update domain stats
            for domain, question_types in self.cognitive_domains.items():
                if question['type'] in question_types:
                    domain_stats[domain]['total'] += 1
                    if is_correct:
                        domain_stats[domain]['correct'] += 1
        
        # Calculate accuracies
        for category in category_stats:
            stats = category_stats[category]
            if stats['total'] > 0:
                stats['accuracy'] = (stats['correct'] / stats['total']) * 100
        
        for domain in domain_stats:
            stats = domain_stats[domain]
            if stats['total'] > 0:
                stats['accuracy'] = (stats['correct'] / stats['total']) * 100
        
        # Identify strengths and weaknesses
        weak_points = self._identify_weak_points(category_stats, domain_stats)
        strong_points = self._identify_strong_points(category_stats, domain_stats)
        
        # Calculate overall score
        total_correct = sum(stats['correct'] for stats in category_stats.values())
        total_questions = sum(stats['total'] for stats in category_stats.values())
        overall_score = (total_correct / total_questions * 100) if total_questions > 0 else 0
        
        # Generate recommendations
        recommendations = self._generate_recommendations(weak_points, domain_stats)
        
        return {
            'overall_score': round(overall_score, 2),
            'total_correct': total_correct,
            'total_questions': total_questions,
            'category_stats': category_stats,
            'domain_stats': domain_stats,
            'weak_points': weak_points,
            'strong_points': strong_points,
            'recommendations': recommendations
        }
    
    def _is_answer_correct(self, answer, question):
        """Check if answer is correct (simplified - in real app, compare with correct answer)"""
        # For demo purposes, we'll use a weighted random based on difficulty
        difficulty = question.get('difficulty', 2)
        # Higher difficulty = lower chance of being correct
        correct_chance = 0.9 - (difficulty * 0.1)
        import random
        return random.random() < correct_chance
    
    def _identify_weak_points(self, category_stats, domain_stats):
        """Identify areas needing improvement"""
        weak_points = []
        
        # Check categories with accuracy < 50%
        for category, stats in category_stats.items():
            if stats.get('accuracy', 0) < 50 and stats['total'] >= 3:  # Need at least 3 questions
                weak_points.append({
                    'area': category,
                    'accuracy': round(stats['accuracy'], 1),
                    'type': 'category'
                })
        
        # Check domains with accuracy < 60%
        for domain, stats in domain_stats.items():
            if stats.get('accuracy', 0) < 60 and stats['total'] >= 5:  # Need at least 5 questions
                weak_points.append({
                    'area': domain,
                    'accuracy': round(stats['accuracy'], 1),
                    'type': 'domain'
                })
        
        return weak_points
    
    def _identify_strong_points(self, category_stats, domain_stats):
        """Identify areas of strength"""
        strong_points = []
        
        # Check categories with accuracy > 80%
        for category, stats in category_stats.items():
            if stats.get('accuracy', 0) > 80 and stats['total'] >= 3:
                strong_points.append({
                    'area': category,
                    'accuracy': round(stats['accuracy'], 1),
                    'type': 'category'
                })
        
        # Check domains with accuracy > 75%
        for domain, stats in domain_stats.items():
            if stats.get('accuracy', 0) > 75 and stats['total'] >= 5:
                strong_points.append({
                    'area': domain,
                    'accuracy': round(stats['accuracy'], 1),
                    'type': 'domain'
                })
        
        return strong_points
    
    def _generate_recommendations(self, weak_points, domain_stats):
        """Generate personalized recommendations based on weak areas"""
        recommendations = []
        
        improvement_map = {
            'Pattern Recognition': [
                "Practice with pattern completion exercises",
                "Try visual sequence games",
                "Work on identifying repeating sequences"
            ],
            'Matrix Reasoning': [
                "Solve matrix-based puzzles regularly",
                "Practice identifying relationships between elements",
                "Work on 3x3 matrix completion exercises"
            ],
            'Abstract Reasoning': [
                "Practice with analogies and metaphors",
                "Solve logic puzzles regularly",
                "Work on identifying underlying principles"
            ],
            'Spatial Reasoning': [
                "Practice mental rotation exercises",
                "Work with 3D puzzles and building blocks",
                "Try spatial visualization games"
            ],
            'Sequential Reasoning': [
                "Practice predicting next items in sequences",
                "Work on number and pattern series",
                "Try memory sequence games"
            ]
        }
        
        for weak_point in weak_points:
            area = weak_point['area']
            if area in improvement_map:
                for recommendation in improvement_map[area]:
                    recommendations.append({
                        'area': area,
                        'recommendation': recommendation,
                        'priority': 'high' if weak_point['accuracy'] < 40 else 'medium'
                    })
        
        # Add general recommendations
        if len(recommendations) < 3:
            general_recommendations = [
                "Practice cognitive skills for 20 minutes daily",
                "Mix different types of puzzles and games",
                "Review incorrect answers to understand mistakes",
                "Take regular breaks during practice sessions"
            ]
            for rec in general_recommendations:
                recommendations.append({
                    'area': 'General',
                    'recommendation': rec,
                    'priority': 'low'
                })
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def calculate_progress(self, child_id, previous_results):
        """Calculate progress over time"""
        if not previous_results or len(previous_results) < 2:
            return None
        
        # Sort by date
        sorted_results = sorted(previous_results, key=lambda x: x.taken_at)
        
        progress_data = {
            'first_test': sorted_results[0].score,
            'latest_test': sorted_results[-1].score,
            'improvement': sorted_results[-1].score - sorted_results[0].score,
            'average_score': sum(r.score for r in sorted_results) / len(sorted_results),
            'test_count': len(sorted_results),
            'trend': 'improving' if sorted_results[-1].score > sorted_results[0].score else 'stable' if sorted_results[-1].score == sorted_results[0].score else 'declining'
        }
        
        return progress_data

analyzer = TestAnalyzer()