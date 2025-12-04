# Extended database models for the application
from app import db
from datetime import datetime
import json

class ProgressTracking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow().date, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Float, nullable=False)
    time_taken = db.Column(db.Integer)  # Time in seconds
    
    def to_dict(self):
        return {
            'id': self.id,
            'child_id': self.child_id,
            'date': self.date.isoformat() if self.date else None,
            'category': self.category,
            'score': self.score,
            'time_taken': self.time_taken
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age_group = db.Column(db.String(10), nullable=False)  # '6-8', '9-11', '12-14'
    question_type = db.Column(db.String(50), nullable=False)  # 'pattern', 'matrix', 'analogy', 'sequence'
    difficulty = db.Column(db.Integer, nullable=False)  # 1-3
    question_data = db.Column(db.Text, nullable=False)  # JSON string with question details
    correct_answer = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    
    def get_question_data(self):
        return json.loads(self.question_data)
    
    def set_question_data(self, data):
        self.question_data = json.dumps(data)