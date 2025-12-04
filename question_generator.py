import json
import random

class AdvancedQuestionGenerator:
    def __init__(self):
        self.patterns_6_8 = [
            {"type": "color_sequence", "difficulty": 1},
            {"type": "shape_size", "difficulty": 1},
            {"type": "simple_pattern", "difficulty": 2},
            {"type": "missing_piece", "difficulty": 2},
            {"type": "complete_sequence", "difficulty": 3}
        ]
        
        self.patterns_9_11 = [
            {"type": "rotation_pattern", "difficulty": 1},
            {"type": "matrix_logic", "difficulty": 2},
            {"type": "analogical_reasoning", "difficulty": 2},
            {"type": "series_completion", "difficulty": 3},
            {"type": "rule_based", "difficulty": 3}
        ]
        
        self.patterns_12_14 = [
            {"type": "abstract_reasoning", "difficulty": 1},
            {"type": "spatial_rotation", "difficulty": 2},
            {"type": "logical_deduction", "difficulty": 3},
            {"type": "complex_matrix", "difficulty": 3},
            {"type": "inferential_reasoning", "difficulty": 3}
        ]
    
    def generate_question(self, age_group, question_id):
        if age_group == '6-8':
            pattern = random.choice(self.patterns_6_8)
            return self._generate_for_6_8(pattern, question_id)
        elif age_group == '9-11':
            pattern = random.choice(self.patterns_9_11)
            return self._generate_for_9_11(pattern, question_id)
        else:  # 12-14
            pattern = random.choice(self.patterns_12_14)
            return self._generate_for_12_14(pattern, question_id)
    
    def _generate_for_6_8(self, pattern, question_id):
        colors = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣']
        shapes = ['⭐', '⬜', '🔺', '🔶', '🔷', '❤️']
        
        if pattern["type"] == "color_sequence":
            sequence = random.sample(colors, 4)
            missing_index = random.randint(0, 3)
            correct = sequence[missing_index]
            sequence[missing_index] = "❓"
            
            return {
                'id': question_id,
                'type': 'color_sequence',
                'question': f"What color comes next in the sequence?\n{' → '.join(sequence)}",
                'options': colors[:4],
                'correct_answer': correct,
                'difficulty': pattern["difficulty"],
                'category': 'Color Pattern Recognition'
            }
        
        elif pattern["type"] == "shape_size":
            sizes = ['Small', 'Medium', 'Large']
            shapes_display = ['Star', 'Square', 'Triangle', 'Heart']
            sequence = []
            for i in range(3):
                size = sizes[i % len(sizes)]
                shape = shapes_display[i % len(shapes_display)]
                sequence.append(f"{size} {shape}")
            
            correct = f"{sizes[3 % len(sizes)]} {shapes_display[3 % len(shapes_display)]}"
            
            return {
                'id': question_id,
                'type': 'shape_size',
                'question': f"Complete the pattern:\n{' → '.join(sequence)} → ❓",
                'options': [
                    f"{random.choice(sizes)} {random.choice(shapes_display)}",
                    f"{random.choice(sizes)} {random.choice(shapes_display)}",
                    correct,
                    f"{random.choice(sizes)} {random.choice(shapes_display)}"
                ],
                'correct_answer': correct,
                'difficulty': pattern["difficulty"],
                'category': 'Size and Shape Pattern'
            }
    
    def _generate_for_9_11(self, pattern, question_id):
        if pattern["type"] == "rotation_pattern":
            rotations = ['0°', '90°', '180°', '270°']
            sequence = random.sample(rotations, 3)
            next_rotation = rotations[(rotations.index(sequence[-1]) + 1) % len(rotations)]
            
            return {
                'id': question_id,
                'type': 'rotation_pattern',
                'question': f"The shapes are rotating. Pattern: {', '.join(sequence)}. What comes next?",
                'options': rotations,
                'correct_answer': next_rotation,
                'difficulty': pattern["difficulty"],
                'category': 'Rotation Pattern'
            }
        
        elif pattern["type"] == "matrix_logic":
            matrix = [
                ['A', 'B', 'C'],
                ['D', 'E', 'F'],
                ['G', 'H', '?']
            ]
            
            patterns = [
                "Row-wise alphabetical",
                "Column-wise alphabetical", 
                "Diagonal pattern",
                "Odd-one-out"
            ]
            
            correct = 'I'  # Next in alphabet
            
            return {
                'id': question_id,
                'type': 'matrix_logic',
                'question': f"Complete the 3x3 matrix:\n{matrix[0]}\n{matrix[1]}\n{matrix[2]}",
                'options': ['H', 'I', 'J', 'K'],
                'correct_answer': correct,
                'difficulty': pattern["difficulty"],
                'category': 'Matrix Logic'
            }
    
    def _generate_for_12_14(self, pattern, question_id):
        if pattern["type"] == "abstract_reasoning":
            sequences = [
                "2, 4, 8, 16, ?",  # Multiply by 2
                "1, 1, 2, 3, 5, ?",  # Fibonacci
                "A, C, E, G, ?",  # Skip one letter
                "1, 4, 9, 16, ?"  # Squares
            ]
            
            seq = random.choice(sequences)
            if "2, 4, 8, 16" in seq:
                correct = "32"
            elif "1, 1, 2, 3, 5" in seq:
                correct = "8"
            elif "A, C, E, G" in seq:
                correct = "I"
            else:
                correct = "25"
            
            return {
                'id': question_id,
                'type': 'abstract_reasoning',
                'question': f"Find the next item in the sequence:\n{seq}",
                'options': ['24', '32', '30', '28'] if "2, 4, 8, 16" in seq else 
                          ['6', '7', '8', '9'] if "1, 1, 2, 3, 5" in seq else
                          ['H', 'I', 'J', 'K'] if "A, C, E, G" in seq else
                          ['20', '25', '30', '36'],
                'correct_answer': correct,
                'difficulty': pattern["difficulty"],
                'category': 'Abstract Reasoning'
            }
        
        elif pattern["type"] == "complex_matrix":
            return {
                'id': question_id,
                'type': 'complex_matrix',
                'question': "In this 3x3 matrix, each cell follows two rules: one for rows and one for columns. Identify the missing cell.",
                'options': ['Pattern A', 'Pattern B', 'Pattern C', 'Pattern D'],
                'correct_answer': 'Pattern B',
                'difficulty': pattern["difficulty"],
                'category': 'Complex Matrix Reasoning'
            }
    
    def generate_question_bank(self, age_group, count=500):
        """Generate a bank of questions for an age group"""
        questions = []
        for i in range(count):
            question = self.generate_question(age_group, i + 1)
            questions.append(question)
        return questions

question_generator = AdvancedQuestionGenerator()