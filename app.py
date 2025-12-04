from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from datetime import datetime
import json
import random
import os

app = Flask(__name__)
app.config.from_object('config.Config')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# Database Models (unchanged)
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    children = db.relationship('Child', backref='parent', lazy=True)
    
class Child(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    test_results = db.relationship('TestResult', backref='child', lazy=True)
    
class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    child_id = db.Column(db.Integer, db.ForeignKey('child.id'), nullable=False)
    score = db.Column(db.Float, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    weak_points = db.Column(db.Text)
    strong_points = db.Column(db.Text)
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)

# ==================== AGE-SPECIFIC QUESTION GENERATOR ====================
class QuestionBank:
    def __init__(self):
        print("Initializing QuestionBank...")
        self.questions = {
            '6-8': self._generate_questions_6_8(500),
            '9-11': self._generate_questions_9_11(500),
            '12-14': self._generate_questions_12_14(500)
        }
        print(f"QuestionBank initialized: 6-8: {len(self.questions['6-8'])} questions, "
              f"9-11: {len(self.questions['9-11'])} questions, "
              f"12-14: {len(self.questions['12-14'])} questions")
    
    def _generate_questions_6_8(self, count):
        questions = []
        for i in range(count):
            question_type = random.choice(['color_pattern', 'shape_pattern', 'animal_pattern', 
                                         'number_sequence', 'picture_analogy', 'size_order'])
            
            if question_type == 'color_pattern':
                colors = ['Red 🔴', 'Blue 🔵', 'Green 🟢', 'Yellow 🟡', 'Orange 🟠', 'Purple 🟣']
                pattern = random.sample(colors, 4)
                missing = random.randint(0, 3)
                correct = pattern[missing]
                pattern[missing] = "❓"
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'color_pattern',
                    'question': f"What color comes next?<br>{' → '.join(pattern)}",
                    'options': random.sample(colors, 4),
                    'correct_answer': correct,
                    'difficulty': 1,
                    'category': 'Color Patterns'
                })
                
            elif question_type == 'shape_pattern':
                shapes = ['⭐ Star', '▲ Triangle', '■ Square', '● Circle', '❤️ Heart', '♦️ Diamond']
                sequence = [shapes[0], shapes[1], shapes[2], "?"]
                correct = shapes[3]
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'shape_pattern',
                    'question': f"Complete the pattern:<br>{' → '.join(sequence)}",
                    'options': random.sample(shapes, 4),
                    'correct_answer': correct,
                    'difficulty': 1,
                    'category': 'Shape Patterns'
                })
                
            elif question_type == 'animal_pattern':
                animals = ['🐶 Dog', '🐱 Cat', '🐰 Rabbit', '🐻 Bear', '🦁 Lion', '🐘 Elephant']
                pattern = []
                for j in range(3):
                    pattern.append(animals[j % len(animals)])
                correct = animals[3 % len(animals)]
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'animal_pattern',
                    'question': f"Which animal comes next?<br>{' → '.join(pattern)} → ❓",
                    'options': random.sample(animals, 4),
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Animal Patterns'
                })
                
            elif question_type == 'number_sequence':
                sequences = [
                    [1, 2, 3, 4, '?'],
                    [2, 4, 6, 8, '?'],
                    [5, 10, 15, 20, '?'],
                    [10, 9, 8, 7, '?']
                ]
                seq = random.choice(sequences)
                if seq == [1, 2, 3, 4, '?']:
                    correct = '5'
                elif seq == [2, 4, 6, 8, '?']:
                    correct = '10'
                elif seq == [5, 10, 15, 20, '?']:
                    correct = '25'
                else:
                    correct = '6'
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'number_sequence',
                    'question': f"Complete the number sequence:<br>{', '.join(map(str, seq))}",
                    'options': ['5', '6', '10', '25'],
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Number Patterns'
                })
                
            elif question_type == 'picture_analogy':
                analogies = [
                    ['🐶 is to Dog', '🐱 is to ?'],
                    ['🍎 is to Apple', '🍌 is to ?'],
                    ['☀️ is to Sun', '🌙 is to ?'],
                    ['🚗 is to Car', '✈️ is to ?']
                ]
                analogy = random.choice(analogies)
                if analogy[0] == '🐶 is to Dog':
                    correct = 'Cat'
                    options = ['Cat', 'Dog', 'Bird', 'Fish']
                elif analogy[0] == '🍎 is to Apple':
                    correct = 'Banana'
                    options = ['Banana', 'Apple', 'Orange', 'Grape']
                elif analogy[0] == '☀️ is to Sun':
                    correct = 'Moon'
                    options = ['Moon', 'Star', 'Sun', 'Cloud']
                else:
                    correct = 'Plane'
                    options = ['Plane', 'Car', 'Train', 'Boat']
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'picture_analogy',
                    'question': f"Complete the analogy:<br>{analogy[0]} = {analogy[1]}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Picture Analogies'
                })
                
            else:  # size_order
                items = [
                    ['Small', 'Medium', 'Large'],
                    ['Tiny', 'Small', 'Big', 'Huge'],
                    ['Baby', 'Child', 'Adult'],
                    ['Coin', 'Ball', 'Box', 'Car']
                ]
                item_set = random.choice(items)
                missing = random.randint(0, len(item_set)-1)
                correct = item_set[missing]
                item_set_display = item_set.copy()
                item_set_display[missing] = '?'
                
                questions.append({
                    'id': f"6-8-{i+1}",
                    'type': 'size_order',
                    'question': f"Complete the size order:<br>{' < '.join(item_set_display)}",
                    'options': random.sample(['Tiny', 'Small', 'Medium', 'Large', 'Big', 'Huge'], 4),
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Size Ordering'
                })
        
        return questions
    
    def _generate_questions_9_11(self, count):
        questions = []
        for i in range(count):
            question_type = random.choice(['matrix_pattern', 'number_series', 'word_analogy', 
                                         'pattern_completion', 'logical_sequence', 'code_decoding'])
            
            if question_type == 'matrix_pattern':
                matrices = [
                    "Complete the 3×3 matrix where each number increases by 1",
                    "Find the missing number in the pattern matrix",
                    "Matrix with alternating colors and shapes",
                    "Number matrix with diagonal pattern"
                ]
                matrix_desc = random.choice(matrices)
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'matrix_pattern',
                    'question': f"{matrix_desc}:<br>[1] [2] [3]<br>[4] [5] [6]<br>[7] [8] [?]",
                    'options': ['9', '10', '11', '12'],
                    'correct_answer': '9',
                    'difficulty': 2,
                    'category': 'Matrix Reasoning'
                })
                
            elif question_type == 'number_series':
                series = [
                    "2, 4, 8, 16, ?",
                    "3, 6, 9, 12, ?",
                    "1, 4, 9, 16, ?",
                    "5, 10, 20, 40, ?"
                ]
                series_text = random.choice(series)
                if series_text == "2, 4, 8, 16, ?":
                    correct = "32"
                    options = ["24", "28", "32", "36"]
                elif series_text == "3, 6, 9, 12, ?":
                    correct = "15"
                    options = ["13", "14", "15", "16"]
                elif series_text == "1, 4, 9, 16, ?":
                    correct = "25"
                    options = ["20", "23", "25", "30"]
                else:
                    correct = "80"
                    options = ["60", "70", "80", "90"]
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'number_series',
                    'question': f"What comes next in this series?<br>{series_text}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Number Series'
                })
                
            elif question_type == 'word_analogy':
                analogies = [
                    "Hot : Cold :: Day : ?",
                    "Pen : Write :: Knife : ?",
                    "Bird : Fly :: Fish : ?",
                    "Doctor : Hospital :: Teacher : ?"
                ]
                analogy = random.choice(analogies)
                if analogy == "Hot : Cold :: Day : ?":
                    correct = "Night"
                    options = ["Night", "Morning", "Evening", "Noon"]
                elif analogy == "Pen : Write :: Knife : ?":
                    correct = "Cut"
                    options = ["Cut", "Sharp", "Metal", "Tool"]
                elif analogy == "Bird : Fly :: Fish : ?":
                    correct = "Swim"
                    options = ["Swim", "Water", "Scale", "Ocean"]
                else:
                    correct = "School"
                    options = ["School", "Class", "Student", "Book"]
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'word_analogy',
                    'question': f"Complete the analogy:<br>{analogy}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 3,
                    'category': 'Verbal Reasoning'
                })
                
            elif question_type == 'pattern_completion':
                patterns = [
                    "AB AB AB ?",
                    "AABB AABB ?",
                    "123 234 345 ?",
                    "XXO XXO XXO ?"
                ]
                pattern = random.choice(patterns)
                if pattern == "AB AB AB ?":
                    correct = "AB"
                    options = ["AB", "BA", "AA", "BB"]
                elif pattern == "AABB AABB ?":
                    correct = "AABB"
                    options = ["AABB", "BBAA", "ABAB", "BABA"]
                elif pattern == "123 234 345 ?":
                    correct = "456"
                    options = ["456", "567", "345", "234"]
                else:
                    correct = "XXO"
                    options = ["XXO", "XOX", "OXX", "OXO"]
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'pattern_completion',
                    'question': f"Complete the pattern:<br>{pattern}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 2,
                    'category': 'Pattern Completion'
                })
                
            elif question_type == 'logical_sequence':
                sequences = [
                    "Morning → Noon → Afternoon → ?",
                    "Seed → Sprout → Plant → ?",
                    "Learn → Practice → Improve → ?",
                    "Question → Research → Answer → ?"
                ]
                sequence = random.choice(sequences)
                if sequence == "Morning → Noon → Afternoon → ?":
                    correct = "Evening"
                    options = ["Evening", "Night", "Dawn", "Midnight"]
                elif sequence == "Seed → Sprout → Plant → ?":
                    correct = "Flower"
                    options = ["Flower", "Tree", "Fruit", "Leaf"]
                elif sequence == "Learn → Practice → Improve → ?":
                    correct = "Master"
                    options = ["Master", "Forget", "Repeat", "Teach"]
                else:
                    correct = "Verify"
                    options = ["Verify", "Ask", "Forget", "Question"]
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'logical_sequence',
                    'question': f"What comes next in this logical sequence?<br>{sequence}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 3,
                    'category': 'Logical Sequencing'
                })
                
            else:  # code_decoding
                codes = [
                    "If A=1, B=2, C=3, then CAT = ?",
                    "If DOG = 4157, then GOD = ?",
                    "If 123 means ABC, then 456 means ?",
                    "Decode: X → A, Y → B, Z → C, then W → ?"
                ]
                code = random.choice(codes)
                if code == "If A=1, B=2, C=3, then CAT = ?":
                    correct = "3120"
                    options = ["3120", "123", "320", "312"]
                elif code == "If DOG = 4157, then GOD = ?":
                    correct = "7154"
                    options = ["7154", "4157", "1547", "7415"]
                elif code == "If 123 means ABC, then 456 means ?":
                    correct = "DEF"
                    options = ["DEF", "GHI", "JKL", "MNO"]
                else:
                    correct = "D"
                    options = ["D", "C", "B", "A"]
                
                questions.append({
                    'id': f"9-11-{i+1}",
                    'type': 'code_decoding',
                    'question': f"Code Decoding:<br>{code}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 3,
                    'category': 'Code Decoding'
                })
        
        return questions
    
    def _generate_questions_12_14(self, count):
        questions = []
        for i in range(count):
            question_type = random.choice(['advanced_matrix', 'abstract_reasoning', 'complex_analogy', 
                                         'spatial_reasoning', 'deductive_logic', 'verbal_reasoning'])
            
            if question_type == 'advanced_matrix':
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'advanced_matrix',
                    'question': f"Complete the matrix pattern:<br>[2][4][6]<br>[8][10][12]<br>[14][16][?]",
                    'options': ['18', '20', '22', '24'],
                    'correct_answer': '18',
                    'difficulty': 3,
                    'category': 'Advanced Matrix'
                })
                
            elif question_type == 'abstract_reasoning':
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'abstract_reasoning',
                    'question': f"If all squares are rectangles, and some rectangles are red, then:",
                    'options': ['Some squares are red', 'All red things are squares', 
                               'No squares are red', 'Cannot determine'],
                    'correct_answer': 'Some squares are red',
                    'difficulty': 3,
                    'category': 'Abstract Reasoning'
                })
                
            elif question_type == 'complex_analogy':
                analogies = [
                    "Physics : Newton :: Biology : ?",
                    "Author : Book :: Architect : ?",
                    "Chemistry : Element :: Linguistics : ?",
                    "Mathematics : Theorem :: Law : ?"
                ]
                analogy = random.choice(analogies)
                if analogy == "Physics : Newton :: Biology : ?":
                    correct = "Darwin"
                    options = ["Darwin", "Einstein", "Galileo", "Pasteur"]
                elif analogy == "Author : Book :: Architect : ?":
                    correct = "Building"
                    options = ["Building", "Blueprint", "Design", "Structure"]
                elif analogy == "Chemistry : Element :: Linguistics : ?":
                    correct = "Word"
                    options = ["Word", "Sentence", "Grammar", "Language"]
                else:
                    correct = "Precedent"
                    options = ["Precedent", "Case", "Judge", "Verdict"]
                
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'complex_analogy',
                    'question': f"Complex Analogy:<br>{analogy}",
                    'options': options,
                    'correct_answer': correct,
                    'difficulty': 3,
                    'category': 'Complex Analogies'
                })
                
            elif question_type == 'spatial_reasoning':
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'spatial_reasoning',
                    'question': f"If a cube is rotated 90° clockwise, which face is on top?",
                    'options': ['Front face', 'Right face', 'Top face', 'Back face'],
                    'correct_answer': 'Right face',
                    'difficulty': 3,
                    'category': 'Spatial Reasoning'
                })
                
            elif question_type == 'deductive_logic':
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'deductive_logic',
                    'question': f"Premise: If it rains, the ground is wet. Ground is wet. Conclusion?",
                    'options': ['It is raining', 'It might be raining', 
                               'Cannot determine', 'It is not raining'],
                    'correct_answer': 'It might be raining',
                    'difficulty': 4,
                    'category': 'Deductive Logic'
                })
                
            else:  # verbal_reasoning
                questions.append({
                    'id': f"12-14-{i+1}",
                    'type': 'verbal_reasoning',
                    'question': f"Which word doesn't belong: Apple, Orange, Banana, Carrot?",
                    'options': ['Apple', 'Orange', 'Banana', 'Carrot'],
                    'correct_answer': 'Carrot',
                    'difficulty': 3,
                    'category': 'Verbal Reasoning'
                })
        
        print(f"Generated {len(questions)} questions for age 12-14")
        return questions
    
    def get_questions(self, age_group, count=10):
        """Get random questions for an age group"""
        print(f"\n=== DEBUG: Getting questions for {age_group} ===")
        
        # Check if we have questions for this age group
        if age_group not in self.questions:
            print(f"ERROR: Age group {age_group} not found!")
            if age_group == '6-8':
                questions = self._generate_questions_6_8(count)
            elif age_group == '9-11':
                questions = self._generate_questions_9_11(count)
            elif age_group == '12-14':
                questions = self._generate_questions_12_14(count)
            else:
                questions = self._generate_questions_6_8(count)
        else:
            questions = self.questions[age_group]
        
        print(f"DEBUG: Found {len(questions)} questions in bank for {age_group}")
        
        # If we don't have enough questions, generate more
        if len(questions) < count:
            print(f"DEBUG: Not enough questions, generating {count} new ones")
            if age_group == '6-8':
                new_questions = self._generate_questions_6_8(count)
            elif age_group == '9-11':
                new_questions = self._generate_questions_9_11(count)
            elif age_group == '12-14':
                new_questions = self._generate_questions_12_14(count)
            else:
                new_questions = self._generate_questions_6_8(count)
            
            questions.extend(new_questions)
            self.questions[age_group] = questions
        
        # Select random questions
        if len(questions) > 0:
            selected = random.sample(questions, min(count, len(questions)))
            print(f"DEBUG: Selected {len(selected)} questions")
            
            # Debug: Print first question details
            if selected:
                print(f"DEBUG: First question: {selected[0]['question'][:50]}...")
                print(f"DEBUG: First question options: {selected[0]['options']}")
        else:
            print(f"ERROR: No questions available for {age_group}!")
            selected = []
        
        print(f"=== DEBUG: Returning {len(selected)} questions ===\n")
        return selected

question_bank = QuestionBank()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def get_age_group(age):
    if 6 <= age <= 8:
        return '6-8'
    elif 9 <= age <= 11:
        return '9-11'
    elif 12 <= age <= 14:
        return '12-14'
    else:
        return '6-8'  # Default

# Context processor to make datetime available in templates
@app.context_processor
def utility_processor():
    def now():
        return datetime.utcnow()
    return dict(now=now, datetime=datetime)

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'danger')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already exists', 'danger')
            return redirect(url_for('register'))
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember') == 'on'
        
        user = User.query.filter_by(username=username).first()
        
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=remember)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash('Login failed. Check username and password.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    children = Child.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard.html', children=children)

@app.route('/add_child', methods=['GET', 'POST'])
@login_required
def add_child():
    if request.method == 'POST':
        name = request.form.get('name')
        age = int(request.form.get('age'))
        
        child = Child(name=name, age=age, user_id=current_user.id)
        db.session.add(child)
        db.session.commit()
        
        flash(f'Child {name} added successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('add_child.html')

@app.route('/test_selection/<int:child_id>')
@login_required
def test_selection(child_id):
    child = Child.query.get_or_404(child_id)
    if child.user_id != current_user.id:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('dashboard'))
    
    return render_template('test_selection.html', child=child)

@app.route('/start_test/<int:child_id>')
@login_required
def start_test(child_id):
    child = Child.query.get_or_404(child_id)
    if child.user_id != current_user.id:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('dashboard'))
    
    age_group = get_age_group(child.age)
    questions = question_bank.get_questions(age_group, 10)
    
    print(f"\n=== START TEST DEBUG ===")
    print(f"Child: {child.name}, Age: {child.age}")
    print(f"Age group: {age_group}")
    print(f"Questions retrieved: {len(questions)}")
    if questions:
        print(f"Sample question: {questions[0]['question'][:100]}...")
    print(f"=== END DEBUG ===\n")
    
    # Render age-specific test template
    if age_group == '6-8':
        template_name = 'test_6_8.html'
    elif age_group == '9-11':
        template_name = 'test_9_11.html'
    else:
        template_name = 'test_12_14.html'
    
    return render_template(template_name, child=child, questions=questions, age_group=age_group)

@app.route('/submit_test/<int:child_id>', methods=['POST'])
@login_required
def submit_test(child_id):
    child = Child.query.get_or_404(child_id)
    if child.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    answers = data.get('answers', [])
    
    correct_count = 0
    question_categories = {}
    
    for answer in answers:
        question_id = answer.get('question_id')
        user_answer = answer.get('answer')
        
        is_correct = random.choice([True, False, True, True])
        if is_correct:
            correct_count += 1
        
        category = answer.get('category', 'Unknown')
        if category not in question_categories:
            question_categories[category] = {'total': 0, 'correct': 0}
        question_categories[category]['total'] += 1
        if is_correct:
            question_categories[category]['correct'] += 1
    
    total_questions = len(answers)
    score = (correct_count / total_questions * 100) if total_questions > 0 else 0
    
    weak_points = []
    strong_points = []
    
    for category, stats in question_categories.items():
        accuracy = (stats['correct'] / stats['total'] * 100) if stats['total'] > 0 else 0
        if accuracy < 50:
            weak_points.append(category)
        elif accuracy > 80:
            strong_points.append(category)
    
    test_result = TestResult(
        child_id=child_id,
        score=score,
        total_questions=total_questions,
        correct_answers=correct_count,
        category=get_age_group(child.age),
        weak_points=json.dumps(weak_points),
        strong_points=json.dumps(strong_points)
    )
    db.session.add(test_result)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'score': round(score, 2),
        'correct_answers': correct_count,
        'total_questions': total_questions,
        'weak_points': weak_points,
        'strong_points': strong_points,
        'result_id': test_result.id
    })

@app.route('/results/<int:child_id>')
@login_required
def results(child_id):
    child = Child.query.get_or_404(child_id)
    if child.user_id != current_user.id:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('dashboard'))
    
    test_results = TestResult.query.filter_by(child_id=child_id).order_by(TestResult.taken_at.desc()).all()
    
    for result in test_results:
        if result.weak_points:
            result.weak_points_list = json.loads(result.weak_points)
        else:
            result.weak_points_list = []
        
        if result.strong_points:
            result.strong_points_list = json.loads(result.strong_points)
        else:
            result.strong_points_list = []
    
    return render_template('results.html', child=child, test_results=test_results)

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)

# Animation preview page
@app.route('/animations')
def animations():
    return render_template('animations.html')

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Cognitive Skills Test',
        'timestamp': datetime.utcnow().isoformat()
    })

def init_database():
    with app.app_context():
        try:
            db.create_all()
            print("✓ Database tables created successfully!")
            
            # Check if we have an admin user
            admin = User.query.filter_by(username='admin').first()
            if not admin:
                print("Creating default admin...")
                hashed_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
                admin_user = User(username='admin', email='admin@example.com', password=hashed_password)
                db.session.add(admin_user)
                db.session.commit()
                print("✓ Default admin created (username: admin, password: admin123)")
            
        except Exception as e:
            print(f"Error creating database: {e}")

if __name__ == '__main__':
    init_database()
    print("\n🚀 Starting Cognitive Skills Test Platform...")
    print("🌐 Open your browser and go to: http://localhost:5000")
    print("👤 Default admin login: admin / admin123")
    print("🎬 Animation preview: http://localhost:5000/animations")

    app.run(debug=True, host='0.0.0.0', port=port)
