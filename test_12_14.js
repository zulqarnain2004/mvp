// Age 12-14: Advanced test functionality with analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log("Age 12-14 advanced test initialized!");
    
    // Debug logging
    console.log("Questions:", questions);
    console.log("Total questions:", questions ? questions.length : 0);
    console.log("Child ID:", childId);
    console.log("Age group:", ageGroup);
    
    // Check if questions are available
    if (!questions || questions.length === 0) {
        console.error("ERROR: No questions available!");
        document.getElementById('test-content').innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fas fa-exclamation-triangle"></i> Test Error</h4>
                <p>No questions available for this test. Please try again.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">Reload</button>
            </div>
        `;
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        return;
    }
    
    // Variables
    let currentQuestion = 0;
    let answers = [];
    let timeLeft = 30 * 60;
    let timerInterval;
    const totalQuestions = questions.length;
    
    // Initialize test
    function initializeTest() {
        console.log(`Starting advanced test with ${totalQuestions} questions`);
        
        // Display first question
        displayQuestion(currentQuestion);
        
        // Start timer
        startTimer();
        
        // Update navigation
        updateNavigation();
        updateProgress();
        
        // Add event listeners
        document.getElementById('prev-btn').addEventListener('click', prevQuestion);
        document.getElementById('next-btn').addEventListener('click', nextQuestion);
    }
    
    // Display question
    function displayQuestion(index) {
        const question = questions[index];
        if (!question) return;
        
        // Create options HTML
        let optionsHtml = '';
        question.options.forEach((option, optIndex) => {
            optionsHtml += `
                <div class="option-matrix-item" onclick="selectOptionAdvanced(${optIndex})">
                    <div class="option-label-matrix">
                        <span class="option-letter-matrix">${String.fromCharCode(65 + optIndex)}</span>
                        <div class="option-content-advanced">
                            <div class="option-text-matrix">${option}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Create question HTML
        const questionHtml = `
            <div class="question-display">
                <div class="question-metadata">
                    <div class="question-number">
                        Question ${index + 1}
                    </div>
                    <div class="difficulty-badge ${getDifficultyClass(question.difficulty)}">
                        ${getDifficultyLabel(question.difficulty)}
                    </div>
                </div>
                
                <div class="question-content">
                    <div class="question-text">
                        ${question.question.replace(/<br>/g, '<br>')}
                    </div>
                </div>
                
                <div class="options-matrix">
                    ${optionsHtml}
                </div>
            </div>
        `;
        
        // Update content
        document.getElementById('test-content').innerHTML = questionHtml;
        
        // Restore previous answer
        const existingAnswer = answers.find(a => a.question_id === question.id);
        if (existingAnswer) {
            selectOptionAdvanced(existingAnswer.option_index);
        }
        
        // Update counters
        updateCounters();
    }
    
    // Get difficulty class
    function getDifficultyClass(difficulty) {
        switch(difficulty) {
            case 1: return 'difficulty-easy';
            case 2: return 'difficulty-medium';
            case 3: return 'difficulty-hard';
            default: return 'difficulty-medium';
        }
    }
    
    // Get difficulty label
    function getDifficultyLabel(difficulty) {
        switch(difficulty) {
            case 1: return 'Easy';
            case 2: return 'Medium';
            case 3: return 'Hard';
            default: return 'Medium';
        }
    }
    
    // Select option
    window.selectOptionAdvanced = function(optionIndex) {
        // Remove selection from all options
        document.querySelectorAll('.option-matrix-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedOption = document.querySelectorAll('.option-matrix-item')[optionIndex];
        if (selectedOption) {
            selectedOption.classList.add('selected');
            
            // Save answer
            saveAnswer(optionIndex);
        }
    }
    
    // Save answer
    function saveAnswer(optionIndex) {
        const question = questions[currentQuestion];
        const existingIndex = answers.findIndex(a => a.question_id === question.id);
        
        const answerData = {
            question_id: question.id,
            answer: question.options[optionIndex],
            option_index: optionIndex,
            category: question.category,
            type: question.type,
            difficulty: question.difficulty
        };
        
        if (existingIndex > -1) {
            answers[existingIndex] = answerData;
        } else {
            answers.push(answerData);
        }
        
        updateAnsweredCount();
    }
    
    // Start timer
    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest();
            }
        }, 1000);
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerElement = document.getElementById('timer');
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Update counters
    function updateCounters() {
        document.getElementById('current-question').textContent = currentQuestion + 1;
    }
    
    // Update answered count
    function updateAnsweredCount() {
        document.getElementById('answered-count').textContent = answers.length;
    }
    
    // Update progress
    function updateProgress() {
        const progress = ((currentQuestion + 1) / totalQuestions) * 100;
        document.getElementById('progress-percentage').textContent = `${Math.round(progress)}%`;
        updateProgressRing(progress);
    }
    
    // Update progress ring
    function updateProgressRing(percent) {
        const circle = document.querySelector('.progress-ring-circle');
        if (!circle) return;
        
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
    
    // Update navigation
    function updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === totalQuestions - 1) {
            nextBtn.innerHTML = '<i class="fas fa-flag-checkered me-2"></i> Submit';
            nextBtn.className = 'nav-control nav-control-submit';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
            nextBtn.className = 'nav-control nav-control-next';
        }
    }
    
    // Next question
    function nextQuestion() {
        if (currentQuestion < totalQuestions - 1) {
            currentQuestion++;
            displayQuestion(currentQuestion);
            updateNavigation();
            updateProgress();
        } else {
            submitTest();
        }
    }
    
    // Previous question
    function prevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion(currentQuestion);
            updateNavigation();
            updateProgress();
        }
    }
    
    // Submit test
    async function submitTest() {
        clearInterval(timerInterval);
        
        // Show loading
        document.getElementById('test-content').innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4 class="mt-4">Processing Results...</h4>
                <p class="text-muted">Analyzing your cognitive performance</p>
            </div>
        `;
        
        try {
            const response = await fetch(`/submit_test/${childId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    answers: answers,
                    time_taken: (30 * 60) - timeLeft
                })
            });
            
            const result = await response.json();
            showResults(result);
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('test-content').innerHTML = `
                <div class="alert alert-danger">
                    <h4>Submission Error</h4>
                    <p>${error.message}</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
                </div>
            `;
        }
    }
    
    // Show results
    function showResults(result) {
        const resultContent = document.getElementById('result-content');
        const scoreColor = result.score >= 80 ? 'text-success' : 
                          result.score >= 60 ? 'text-warning' : 'text-danger';
        
        resultContent.innerHTML = `
            <div class="text-center">
                <div class="display-1 ${scoreColor} fw-bold mb-3">${result.score.toFixed(1)}%</div>
                <h4 class="mb-4">${result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}</h4>
                
                <div class="row mt-4">
                    <div class="col-md-6 mb-3">
                        <div class="card bg-dark">
                            <div class="card-body">
                                <h5 class="card-title">Correct Answers</h5>
                                <div class="display-4">${result.correct_answers}/${result.total_questions}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card bg-dark">
                            <div class="card-body">
                                <h5 class="card-title">Performance</h5>
                                <div class="display-4">${result.score.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${result.strong_points && result.strong_points.length > 0 ? `
                <div class="alert alert-success mt-3">
                    <h5><i class="fas fa-thumbs-up me-2"></i> Strong Points</h5>
                    <div class="mt-2">
                        ${result.strong_points.map(point => `<span class="badge bg-success me-2 mb-2">${point}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${result.weak_points && result.weak_points.length > 0 ? `
                <div class="alert alert-warning mt-3">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i> Areas for Improvement</h5>
                    <div class="mt-2">
                        ${result.weak_points.map(point => `<span class="badge bg-warning me-2 mb-2">${point}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('completion-modal'));
        modal.show();
    }
    
    // Initialize test
    setTimeout(initializeTest, 500);
});