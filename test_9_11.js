// Age 9-11 specific test functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Age 9-11 test initialized!");
    
    // Variables
    let currentQuestion = 0;
    let answers = [];
    let timeLeft = 30 * 60;
    let timerInterval;
    const totalQuestions = questions.length;
    let startTime = Date.now();
    
    // Initialize test
    function initializeTest() {
        console.log(`Starting interactive test for age 9-11 with ${totalQuestions} questions`);
        
        // Initialize animations
        initializeAnimations();
        createInteractiveBackground();
        setupQuestionIndicators();
        
        // Display first question
        displayQuestion(currentQuestion);
        
        // Start enhanced timer
        startEnhancedTimer();
        
        // Setup navigation
        updateNavigation();
        updateAllStats();
        
        // Add interactive effects
        addInteractiveEffects();
    }
    
    // Display question with interactive elements
    function displayQuestion(index) {
        const question = questions[index];
        if (!question) return;
        
        // Create interactive options
        let optionsHtml = '';
        const optionLetters = ['A', 'B', 'C', 'D'];
        const optionIcons = ['🔷', '🔶', '🔺', '⭐'];
        
        question.options.forEach((option, optIndex) => {
            optionsHtml += `
                <div class="option-interactive" onclick="selectOption9_11(${optIndex})" 
                     data-index="${optIndex}">
                    <div class="option-header">
                        <span class="option-icon">${optionIcons[optIndex]}</span>
                        <span class="option-letter">${optionLetters[optIndex]}</span>
                        <span class="option-indicator"></span>
                    </div>
                    <div class="option-body">
                        <div class="option-text">${option}</div>
                    </div>
                    <div class="option-footer">
                        <div class="option-hint">Click to select</div>
                    </div>
                </div>
            `;
        });
        
        // Get question icon and color based on type
        const questionMeta = getQuestionMetadata(question);
        
        // Create question HTML
        const questionHtml = `
            <div class="question-interactive" data-question-id="${question.id}">
                <div class="question-top">
                    <div class="question-meta">
                        <div class="question-type" style="color: ${questionMeta.color}">
                            <i class="${questionMeta.icon}"></i>
                            ${questionMeta.label}
                        </div>
                        <div class="question-difficulty">
                            <div class="difficulty-level">Level ${question.difficulty}</div>
                            <div class="difficulty-dots">
                                ${'•'.repeat(question.difficulty)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="question-main">
                    <div class="question-number-display">
                        <span class="current-num">${index + 1}</span>
                        <span class="total-num">/${totalQuestions}</span>
                    </div>
                    
                    <div class="question-content">
                        <h3 class="question-title">${question.category}</h3>
                        <div class="question-text">
                            ${question.question.replace(/<br>/g, '<br>')}
                        </div>
                    </div>
                </div>
                
                <div class="options-interactive-grid">
                    ${optionsHtml}
                </div>
                
                <div class="question-hint">
                    <i class="fas fa-lightbulb"></i>
                    <span>Tip: Think carefully before selecting your answer</span>
                </div>
            </div>
        `;
        
        // Update content with animation
        const testContent = document.getElementById('test-content');
        gsap.to(testContent, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                testContent.innerHTML = questionHtml;
                gsap.from(testContent, {
                    opacity: 0,
                    y: 30,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Restore previous answer
                const existingAnswer = answers.find(a => a.question_id === question.id);
                if (existingAnswer) {
                    selectOption9_11(existingAnswer.option_index);
                }
                
                // Update stats
                updateQuestionStats();
                updateProgressVisual();
                
                // Add interactive effects to new options
                setupOptionInteractions();
            }
        });
    }
    
    // Get question metadata
    function getQuestionMetadata(question) {
        const types = {
            'pattern': { icon: 'fas fa-th-large', label: 'Pattern Recognition', color: '#667eea' },
            'matrix': { icon: 'fas fa-border-all', label: 'Matrix Reasoning', color: '#764ba2' },
            'analogy': { icon: 'fas fa-balance-scale', label: 'Analogical Reasoning', color: '#10b981' },
            'sequence': { icon: 'fas fa-sort-amount-down', label: 'Sequential Reasoning', color: '#f59e0b' },
            'logic': { icon: 'fas fa-brain', label: 'Logical Reasoning', color: '#ef4444' },
            'spatial': { icon: 'fas fa-cube', label: 'Spatial Reasoning', color: '#8b5cf6' }
        };
        
        for (const [key, value] of Object.entries(types)) {
            if (question.type.includes(key)) {
                return value;
            }
        }
        
        return { icon: 'fas fa-question-circle', label: 'General Reasoning', color: '#94a3b8' };
    }
    
    // Select option with interactive feedback
    window.selectOption9_11 = function(optionIndex) {
        // Remove selection from all options
        document.querySelectorAll('.option-interactive').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
            option.style.transform = 'scale(1)';
        });
        
        // Add selection to clicked option
        const selectedOption = document.querySelector(`.option-interactive[data-index="${optionIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            
            // Add selection animation
            gsap.to(selectedOption, {
                scale: 1.03,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Add ripple effect
            createRippleEffect(selectedOption);
            
            // Save answer
            saveAnswer9_11(optionIndex);
            
            // Update selection indicator
            updateSelectionIndicator();
        }
    }
    
    // Save answer
    function saveAnswer9_11(optionIndex) {
        const question = questions[currentQuestion];
        const existingIndex = answers.findIndex(a => a.question_id === question.id);
        
        const answerData = {
            question_id: question.id,
            answer: question.options[optionIndex],
            option_index: optionIndex,
            category: question.category,
            type: question.type,
            difficulty: question.difficulty,
            timestamp: Date.now()
        };
        
        if (existingIndex > -1) {
            answers[existingIndex] = answerData;
        } else {
            answers.push(answerData);
        }
        
        updateAllStats();
    }
    
    // Start enhanced timer
    function startEnhancedTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Update time used
            updateTimeUsed();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest9_11();
            }
        }, 1000);
    }
    
    // Update timer display with progress
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerElement = document.getElementById('timer');
        const progressElement = document.getElementById('timer-progress');
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Update progress
            const progressPercent = (timeLeft / (30 * 60)) * 100;
            if (progressElement) {
                progressElement.style.width = `${progressPercent}%`;
                
                // Change color based on time
                if (progressPercent < 20) {
                    progressElement.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                    timerElement.style.color = '#ef4444';
                } else if (progressPercent < 50) {
                    progressElement.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
                    timerElement.style.color = '#f59e0b';
                }
            }
        }
    }
    
    // Update time used
    function updateTimeUsed() {
        const timeUsed = (30 * 60) - timeLeft;
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;
        const timeUsedElement = document.getElementById('time-used');
        
        if (timeUsedElement) {
            timeUsedElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} Used`;
        }
    }
    
    // Update all statistics
    function updateAllStats() {
        updateProgressStats();
        updateAnsweredStats();
        updateTimeStats();
        updateProgressVisual();
    }
    
    // Update progress statistics
    function updateProgressStats() {
        const progress = ((currentQuestion + 1) / totalQuestions) * 100;
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressBar) {
            gsap.to(progressBar, {
                width: `${progress}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
        
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(progress)}%`;
        }
        
        document.getElementById('question-current').textContent = currentQuestion + 1;
        document.getElementById('question-counter').textContent = 
            `Question ${currentQuestion + 1} of ${totalQuestions}`;
    }
    
    // Update answered statistics
    function updateAnsweredStats() {
        const answeredCount = answers.length;
        document.getElementById('answers-count').textContent = answeredCount;
    }
    
    // Update time statistics
    function updateTimeStats() {
        const timeUsed = (30 * 60) - timeLeft;
        const avgTime = answers.length > 0 ? timeUsed / answers.length : 0;
        
        // Update average time if element exists
        const avgTimeElement = document.getElementById('avg-time');
        if (avgTimeElement) {
            avgTimeElement.textContent = `${Math.round(avgTime)}s avg`;
        }
    }
    
    // Update progress visual
    function updateProgressVisual() {
        const progressFill = document.getElementById('progress-fill');
        const progress = ((currentQuestion + 1) / totalQuestions) * 100;
        
        if (progressFill) {
            gsap.to(progressFill, {
                width: `${progress}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }
    
    // Update question stats
    function updateQuestionStats() {
        const currentElement = document.getElementById('current-question');
        const totalElement = document.getElementById('questions-total');
        
        if (currentElement) currentElement.textContent = currentQuestion + 1;
        if (totalElement) totalElement.textContent = totalQuestions;
    }
    
    // Update selection indicator
    function updateSelectionIndicator() {
        const indicator = document.querySelector('.option-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            gsap.to(indicator, {
                scale: 1.2,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }
    }
    
    // Update navigation
    function updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === totalQuestions - 1) {
            nextBtn.innerHTML = '<i class="fas fa-flag-checkered me-2"></i> Complete Assessment';
            nextBtn.className = 'nav-btn nav-btn-submit';
        } else {
            nextBtn.innerHTML = 'Continue <i class="fas fa-arrow-right ms-2"></i>';
            nextBtn.className = 'nav-btn nav-btn-next';
        }
    }
    
    // Next question with transition
    window.nextQuestion9_11 = function() {
        if (currentQuestion < totalQuestions - 1) {
            // Transition out
            gsap.to('#test-content', {
                opacity: 0,
                x: -50,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    currentQuestion++;
                    displayQuestion(currentQuestion);
                    updateNavigation();
                    updateAllStats();
                    
                    // Transition in
                    gsap.from('#test-content', {
                        opacity: 0,
                        x: 50,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        } else {
            submitTest9_11();
        }
    }
    
    // Previous question with transition
    window.prevQuestion9_11 = function() {
        if (currentQuestion > 0) {
            // Transition out
            gsap.to('#test-content', {
                opacity: 0,
                x: 50,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    currentQuestion--;
                    displayQuestion(currentQuestion);
                    updateNavigation();
                    updateAllStats();
                    
                    // Transition in
                    gsap.from('#test-content', {
                        opacity: 0,
                        x: -50,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }
    }
    
    // Submit test
    async function submitTest9_11() {
        clearInterval(timerInterval);
        
        // Show processing animation
        document.getElementById('test-content').innerHTML = `
            <div class="processing-animation">
                <div class="processing-circle">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
                <h4 class="mt-4">Processing Results...</h4>
                <p class="text-muted">Analyzing your cognitive performance</p>
                <div class="processing-stats">
                    <div class="stat">
                        <span class="value">${answers.length}</span>
                        <span class="label">Questions Answered</span>
                    </div>
                    <div class="stat">
                        <span class="value">${formatTime((30 * 60) - timeLeft)}</span>
                        <span class="label">Time Taken</span>
                    </div>
                </div>
            </div>
        `;
        
        // Disable navigation
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        
        try {
            const response = await fetch(`/submit_test/${childId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    answers: answers,
                    time_taken: (30 * 60) - timeLeft,
                    start_time: startTime
                })
            });
            
            const result = await response.json();
            showResults9_11(result);
        } catch (error) {
            showError('Unable to submit results. Please check your connection.');
        }
    }
    
    // Show results with analytics
    function showResults9_11(result) {
        const resultContent = document.getElementById('result-content');
        
        // Calculate performance metrics
        const accuracy = (result.correct_answers / result.total_questions) * 100;
        const timePerQuestion = ((30 * 60) - timeLeft) / result.total_questions;
        const performanceLevel = getPerformanceLevel(accuracy);
        
        resultContent.innerHTML = `
            <div class="results-analytics">
                <div class="score-highlight">
                    <div class="score-circle-analytic" data-score="${accuracy}">
                        <span class="score-value">${Math.round(accuracy)}</span>
                        <span class="score-label">%</span>
                    </div>
                    <div class="score-details">
                        <h3>${performanceLevel.title}</h3>
                        <p class="performance-desc">${performanceLevel.description}</p>
                    </div>
                </div>
                
                <div class="analytics-grid">
                    <div class="analytic-card">
                        <div class="analytic-icon" style="background: rgba(102, 126, 234, 0.1);">
                            <i class="fas fa-check-circle" style="color: #667eea;"></i>
                        </div>
                        <div class="analytic-content">
                            <div class="analytic-value">${result.correct_answers}/${result.total_questions}</div>
                            <div class="analytic-label">Correct Answers</div>
                        </div>
                    </div>
                    
                    <div class="analytic-card">
                        <div class="analytic-icon" style="background: rgba(16, 185, 129, 0.1);">
                            <i class="fas fa-bolt" style="color: #10b981;"></i>
                        </div>
                        <div class="analytic-content">
                            <div class="analytic-value">${Math.round(timePerQuestion)}s</div>
                            <div class="analytic-label">Avg Time per Question</div>
                        </div>
                    </div>
                    
                    <div class="analytic-card">
                        <div class="analytic-icon" style="background: rgba(245, 158, 11, 0.1);">
                            <i class="fas fa-chart-line" style="color: #f59e0b;"></i>
                        </div>
                        <div class="analytic-content">
                            <div class="analytic-value">${result.score.toFixed(1)}%</div>
                            <div class="analytic-label">Overall Score</div>
                        </div>
                    </div>
                    
                    <div class="analytic-card">
                        <div class="analytic-icon" style="background: rgba(139, 92, 246, 0.1);">
                            <i class="fas fa-trophy" style="color: #8b5cf6;"></i>
                        </div>
                        <div class="analytic-content">
                            <div class="analytic-value">${performanceLevel.level}</div>
                            <div class="analytic-label">Performance Level</div>
                        </div>
                    </div>
                </div>
                
                ${result.strong_points && result.strong_points.length > 0 ? `
                <div class="strengths-analysis">
                    <h5><i class="fas fa-star me-2"></i> Areas of Strength</h5>
                    <div class="strengths-tags">
                        ${result.strong_points.map(point => `
                            <span class="strength-tag">
                                <i class="fas fa-check-circle me-1"></i>
                                ${point}
                            </span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${result.weak_points && result.weak_points.length > 0 ? `
                <div class="improvements-analysis">
                    <h5><i class="fas fa-rocket me-2"></i> Opportunities for Growth</h5>
                    <div class="improvements-list">
                        ${result.weak_points.map(point => `
                            <div class="improvement-item">
                                <i class="fas fa-bullseye me-2"></i>
                                <span>Focus on improving ${point}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="recommendations">
                    <h5><i class="fas fa-lightbulb me-2"></i> Recommendations</h5>
                    <div class="recommendation-cards">
                        <div class="recommendation-card">
                            <i class="fas fa-clock"></i>
                            <p>Practice regularly to improve speed and accuracy</p>
                        </div>
                        <div class="recommendation-card">
                            <i class="fas fa-puzzle-piece"></i>
                            <p>Try different types of puzzles to develop diverse skills</p>
                        </div>
                        <div class="recommendation-card">
                            <i class="fas fa-chart-bar"></i>
                            <p>Review your answers to understand mistakes</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update final time
        document.getElementById('final-time').textContent = 
            formatTime((30 * 60) - timeLeft);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('completion-modal'));
        modal.show();
        
        // Animate score circle
        setTimeout(() => {
            const scoreCircle = document.querySelector('.score-circle-analytic');
            if (scoreCircle) {
                const score = parseInt(scoreCircle.dataset.score);
                gsap.to(scoreCircle, {
                    scale: 1.1,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        }, 500);
        
        // Setup retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            modal.hide();
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
    
    // Get performance level
    function getPerformanceLevel(accuracy) {
        if (accuracy >= 90) {
            return {
                level: 'Expert',
                title: 'Outstanding Performance!',
                description: 'Exceptional cognitive abilities demonstrated'
            };
        } else if (accuracy >= 75) {
            return {
                level: 'Advanced',
                title: 'Excellent Work!',
                description: 'Strong problem-solving skills shown'
            };
        } else if (accuracy >= 60) {
            return {
                level: 'Proficient',
                title: 'Good Performance',
                description: 'Solid understanding of concepts'
            };
        } else {
            return {
                level: 'Developing',
                title: 'Keep Practicing!',
                description: 'Room for improvement with practice'
            };
        }
    }
    
    // Initialize animations
    function initializeAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .option-interactive {
                opacity: 0;
                transform: translateY(20px);
                animation: optionAppear9_11 0.5s ease-out forwards;
            }
            
            @keyframes optionAppear9_11 {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .processing-animation {
                text-align: center;
                padding: 40px;
            }
            
            .processing-circle {
                display: inline-flex;
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .processing-circle .circle {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #667eea;
                animation: processingBounce 1.4s infinite;
            }
            
            .processing-circle .circle:nth-child(2) {
                animation-delay: 0.2s;
                background: #764ba2;
            }
            
            .processing-circle .circle:nth-child(3) {
                animation-delay: 0.4s;
                background: #10b981;
            }
            
            @keyframes processingBounce {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-20px);
                }
            }
            
            .processing-stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-top: 30px;
            }
            
            .processing-stats .stat {
                text-align: center;
            }
            
            .processing-stats .value {
                display: block;
                font-size: 2rem;
                font-weight: 700;
                color: #667eea;
            }
            
            .processing-stats .label {
                display: block;
                font-size: 0.9rem;
                color: #718096;
            }
            
            /* Results Analytics Styles */
            .results-analytics {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .score-highlight {
                display: flex;
                align-items: center;
                gap: 40px;
                margin-bottom: 40px;
                padding: 30px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
                border-radius: 20px;
            }
            
            .score-circle-analytic {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                font-weight: 700;
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
            }
            
            .score-circle-analytic .score-label {
                font-size: 1.2rem;
                opacity: 0.8;
            }
            
            .analytics-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin: 30px 0;
            }
            
            .analytic-card {
                background: white;
                border-radius: 15px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                transition: transform 0.3s ease;
            }
            
            .analytic-card:hover {
                transform: translateY(-5px);
            }
            
            .analytic-icon {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }
            
            .analytic-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #2d3748;
            }
            
            .analytic-label {
                font-size: 0.9rem;
                color: #718096;
            }
            
            .strengths-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }
            
            .strength-tag {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .improvements-list {
                margin-top: 15px;
            }
            
            .improvement-item {
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
            }
            
            .improvement-item:last-child {
                border-bottom: none;
            }
            
            .improvement-item i {
                color: #f59e0b;
            }
            
            .recommendation-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-top: 20px;
            }
            
            .recommendation-card {
                background: white;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
                transition: transform 0.3s ease;
            }
            
            .recommendation-card:hover {
                transform: translateY(-5px);
            }
            
            .recommendation-card i {
                font-size: 2.5rem;
                color: #667eea;
                margin-bottom: 15px;
            }
            
            .recommendation-card p {
                color: #4a5568;
                line-height: 1.5;
                margin: 0;
            }
            
            @media (max-width: 768px) {
                .analytics-grid {
                    grid-template-columns: 1fr;
                }
                
                .recommendation-cards {
                    grid-template-columns: 1fr;
                }
                
                .score-highlight {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create interactive background
    function createInteractiveBackground() {
        const container = document.createElement('div');
        container.className = 'interactive-bg';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.getElementById('test-container').appendChild(container);
        
        // Add animated elements
        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            element.className = 'bg-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: linear-gradient(45deg, 
                    rgba(102, 126, 234, ${Math.random() * 0.05}), 
                    rgba(118, 75, 162, ${Math.random() * 0.05}));
                border-radius: ${Math.random() > 0.5 ? '50%' : '20px'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.1 + 0.05};
                animation: floatElement ${Math.random() * 30 + 20}s infinite linear;
            `;
            container.appendChild(element);
        }
        
        // Add animation
        const bgStyle = document.createElement('style');
        bgStyle.textContent = `
            @keyframes floatElement {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(bgStyle);
    }
    
    // Setup question indicators
    function setupQuestionIndicators() {
        // Implementation depends on HTML structure
    }
    
    // Add interactive effects
    function addInteractiveEffects() {
        // Add hover effects to buttons
        document.querySelectorAll('.btn, .nav-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2
                });
            });
        });
    }
    
    // Setup option interactions
    function setupOptionInteractions() {
        document.querySelectorAll('.option-interactive').forEach(option => {
            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('selected')) {
                    gsap.to(option, {
                        scale: 1.02,
                        duration: 0.2
                    });
                }
            });
            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('selected')) {
                    gsap.to(option, {
                        scale: 1,
                        duration: 0.2
                    });
                }
            });
        });
    }
    
    // Create ripple effect
    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${rect.left + rect.width / 2 - 50}px;
            top: ${rect.top + rect.height / 2 - 50}px;
            z-index: 1000;
            transform: scale(0);
        `;
        document.body.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 3,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }
    
    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Show error
    function showError(message) {
        const errorHtml = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h4>Something went wrong</h4>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    <i class="fas fa-redo me-2"></i> Try Again
                </button>
            </div>
        `;
        
        document.getElementById('test-content').innerHTML = errorHtml;
    }
    
    // Add event listeners
    document.getElementById('prev-btn').addEventListener('click', window.prevQuestion9_11);
    document.getElementById('next-btn').addEventListener('click', window.nextQuestion9_11);
    
    // Initialize test
    setTimeout(initializeTest, 300);
});