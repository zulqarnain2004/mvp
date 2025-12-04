// Test functionality JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("Test.js loaded successfully!");
    
    // Test variables
    let currentQuestion = 0;
    let answers = [];
    let timeLeft = 30 * 60; // 30 minutes in seconds
    let timerInterval;
    let totalQuestions = questions.length;
    
    // Initialize the test
    function initializeTest() {
        console.log("Initializing test with", totalQuestions, "questions");
        
        if (totalQuestions === 0) {
            showError("No questions available. Please try again.");
            return;
        }
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        // Set age-specific class
        document.getElementById('test-content').className = `age-${ageGroup.replace('-', '-')}`;
        
        // Display first question
        displayQuestion(currentQuestion);
        
        // Start timer
        startTimer();
        
        // Update navigation
        updateNavigation();
        
        // Update progress
        updateProgress();
        
        // Initialize question indicators
        initQuestionIndicators();
        
        console.log("Test initialized successfully!");
    }
    
    // Display a specific question
    function displayQuestion(index) {
        const question = questions[index];
        if (!question) {
            console.error("Question not found at index", index);
            return;
        }
        
        console.log("Displaying question", index + 1, ":", question);
        
        // Create question HTML
        let optionsHtml = '';
        question.options.forEach((option, optIndex) => {
            const optionLetter = String.fromCharCode(65 + optIndex);
            optionsHtml += `
                <div class="option-item" data-index="${optIndex}" onclick="selectOption(${optIndex})">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="question_${question.id}" 
                               id="option_${optIndex}" value="${option}">
                        <label class="form-check-label w-100" for="option_${optIndex}">
                            <strong>${optionLetter}.</strong> ${option}
                        </label>
                    </div>
                </div>
            `;
        });
        
        // Determine question icon based on type
        let questionIcon = '❓';
        if (question.type.includes('color') || question.type.includes('pattern')) {
            questionIcon = '🎨';
        } else if (question.type.includes('number') || question.type.includes('matrix')) {
            questionIcon = '🔢';
        } else if (question.type.includes('analogy')) {
            questionIcon = '💭';
        } else if (question.type.includes('shape') || question.type.includes('spatial')) {
            questionIcon = '🔺';
        } else if (question.type.includes('logic')) {
            questionIcon = '🧠';
        } else if (question.type.includes('animal')) {
            questionIcon = '🐾';
        }
        
        // Create question card
        const questionHtml = `
            <div class="question-card">
                <div class="question-header">
                    <div class="d-flex align-items-center">
                        <span class="fs-2 me-3">${questionIcon}</span>
                        <div>
                            <h4 class="mb-1">Question ${index + 1}</h4>
                            <p class="mb-0 opacity-75">${question.category} | Difficulty: ${'★'.repeat(question.difficulty)}</p>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="question-text fs-5 mb-4">
                        ${question.question.replace(/<br>/g, '<br>')}
                    </div>
                    <div class="options-container">
                        ${optionsHtml}
                    </div>
                </div>
            </div>
        `;
        
        // Update the content
        document.getElementById('test-content').innerHTML = questionHtml;
        
        // Restore previous answer if exists
        const existingAnswer = answers.find(a => a.question_id === question.id);
        if (existingAnswer) {
            selectOption(existingAnswer.option_index);
        }
        
        // Update question counter
        updateQuestionCounter();
        
        // Update question indicators
        updateQuestionIndicators();
    }
    
    // Select an option
    window.selectOption = function(optionIndex) {
        const optionItems = document.querySelectorAll('.option-item');
        optionItems.forEach(item => item.classList.remove('selected'));
        
        const selectedItem = document.querySelector(`.option-item[data-index="${optionIndex}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            const radioInput = selectedItem.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
            }
            
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
        
        console.log("Answer saved:", answerData);
        console.log("Total answers:", answers.length);
        
        // Update progress
        updateProgress();
    }
    
    // Update question counter
    function updateQuestionCounter() {
        document.getElementById('question-counter').textContent = 
            `Question ${currentQuestion + 1} of ${totalQuestions}`;
    }
    
    // Update progress bar and text
    function updateProgress() {
        const progress = ((currentQuestion + 1) / totalQuestions) * 100;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        document.getElementById('progress-text').textContent = `${Math.round(progress)}% Complete`;
    }
    
    // Update navigation buttons
    function updateNavigation() {
        document.getElementById('prev-btn').disabled = currentQuestion === 0;
        
        if (currentQuestion === totalQuestions - 1) {
            document.getElementById('next-btn').innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Test';
            document.getElementById('next-btn').classList.remove('btn-primary');
            document.getElementById('next-btn').classList.add('btn-success');
        } else {
            document.getElementById('next-btn').innerHTML = 'Next <i class="fas fa-arrow-right ms-2"></i>';
            document.getElementById('next-btn').classList.remove('btn-success');
            document.getElementById('next-btn').classList.add('btn-primary');
        }
    }
    
    // Initialize question indicators
    function initQuestionIndicators() {
        const container = document.getElementById('question-indicators');
        container.innerHTML = '';
        
        for (let i = 0; i < totalQuestions; i++) {
            const dot = document.createElement('div');
            dot.className = 'question-dot';
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                currentQuestion = i;
                displayQuestion(currentQuestion);
                updateNavigation();
                updateProgress();
            });
            container.appendChild(dot);
        }
        
        container.style.display = 'flex';
        updateQuestionIndicators();
    }
    
    // Update question indicators
    function updateQuestionIndicators() {
        const dots = document.querySelectorAll('.question-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('current', 'answered');
            if (index === currentQuestion) {
                dot.classList.add('current');
            }
            if (answers.some(a => a.question_id === questions[index]?.id)) {
                dot.classList.add('answered');
            }
        });
    }
    
    // Start timer
    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(function() {
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
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when time is running out
            if (timeLeft < 5 * 60) {
                timerElement.style.background = 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)';
            }
        }
    }
    
    // Next question
    window.nextQuestion = function() {
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
    window.prevQuestion = function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion(currentQuestion);
            updateNavigation();
            updateProgress();
        }
    }
    
    // Submit test
    window.submitTest = async function() {
        clearInterval(timerInterval);
        
        // Show loading state
        document.getElementById('test-content').innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4 class="mt-4">Submitting your test...</h4>
                <p class="text-muted">Please wait while we calculate your results.</p>
            </div>
        `;
        
        // Disable navigation buttons
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        
        try {
            console.log("Submitting answers:", answers);
            
            const response = await fetch(`/submit_test/${childId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    answers: answers,
                    time_taken: (30 * 60) - timeLeft
                })
            });
            
            const result = await response.json();
            console.log("Submission result:", result);
            
            if (result.success) {
                showResults(result);
            } else {
                showError('Error submitting test: ' + result.error);
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please check your connection and try again.');
        }
    }
    
    // Show results
    function showResults(result) {
        const resultContent = document.getElementById('result-content');
        
        // Determine score color
        let scoreColor = 'text-danger';
        let scoreMessage = 'Keep practicing!';
        if (result.score >= 80) {
            scoreColor = 'text-success';
            scoreMessage = 'Excellent!';
        } else if (result.score >= 60) {
            scoreColor = 'text-warning';
            scoreMessage = 'Good job!';
        }
        
        resultContent.innerHTML = `
            <div class="text-center">
                <div class="display-1 ${scoreColor} fw-bold">${result.score.toFixed(1)}%</div>
                <h4 class="mb-4">${scoreMessage}</h4>
                
                <div class="row mt-4">
                    <div class="col-md-6 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">Correct Answers</h5>
                                <div class="display-4">${result.correct_answers}/${result.total_questions}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">Score</h5>
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
                
                <div class="alert alert-info mt-3">
                    <h5><i class="fas fa-lightbulb me-2"></i> Recommendations</h5>
                    <p class="mb-0">
                        ${result.weak_points && result.weak_points.length > 0 
                            ? 'Practice more on your weak areas to improve your score.' 
                            : 'Great job! Keep practicing to maintain your skills.'}
                    </p>
                </div>
            </div>
        `;
        
        // Update view results button
        document.getElementById('view-results-btn').href = `/results/${childId}`;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('completion-modal'));
        modal.show();
    }
    
    // Show error message
    function showError(message) {
        document.getElementById('test-content').innerHTML = `
            <div class="alert alert-danger">
                <h4><i class="fas fa-exclamation-triangle me-2"></i> Error</h4>
                <p>${message}</p>
                <a href="/dashboard" class="btn btn-primary mt-2">Back to Dashboard</a>
            </div>
        `;
    }
    
    // Add event listeners
    document.getElementById('prev-btn').addEventListener('click', window.prevQuestion);
    document.getElementById('next-btn').addEventListener('click', window.nextQuestion);
    
    // Initialize test after a short delay to ensure DOM is ready
    setTimeout(initializeTest, 100);
});