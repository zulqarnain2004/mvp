// Age 6-8 specific test functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Age 6-8 test initialized!");
    
    // Variables
    let currentQuestion = 0;
    let answers = [];
    let timeLeft = 30 * 60; // 30 minutes
    let timerInterval;
    const totalQuestions = questions.length;
    
    // Initialize test
    function initializeTest() {
        console.log(`Starting test for age 6-8 with ${totalQuestions} questions`);
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        // Add fun animations
        addFunAnimations();
        createFloatingEmojis();
        addBounceToElements();
        
        // Display first question
        displayQuestion(currentQuestion);
        
        // Start timer
        startTimer();
        
        // Initialize navigation
        updateNavigation();
        updateProgress();
        
        // Add click sounds (visual feedback)
        addClickEffects();
    }
    
    // Display question with kid-friendly design
    function displayQuestion(index) {
        const question = questions[index];
        if (!question) return;
        
        // Create question with emojis and bright colors
        let optionsHtml = '';
        const optionLetters = ['A', 'B', 'C', 'D'];
        const optionColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];
        const optionEmojis = ['🔴', '🔵', '🟢', '🟡'];
        
        question.options.forEach((option, optIndex) => {
            optionsHtml += `
                <div class="option-card" onclick="selectOption6_8(${optIndex})" 
                     style="border-color: ${optionColors[optIndex]}; animation-delay: ${optIndex * 0.1}s;">
                    <div class="option-content">
                        <span class="option-emoji">${optionEmojis[optIndex]}</span>
                        <span class="option-letter" style="background: ${optionColors[optIndex]}">
                            ${optionLetters[optIndex]}
                        </span>
                        <span class="option-text">${option}</span>
                    </div>
                    <div class="option-selector">
                        <div class="selector-dot"></div>
                    </div>
                </div>
            `;
        });
        
        // Get appropriate emoji for question type
        let questionEmoji = '❓';
        if (question.type.includes('color')) questionEmoji = '🎨';
        if (question.type.includes('shape')) questionEmoji = '🔺';
        if (question.type.includes('animal')) questionEmoji = '🐶';
        if (question.type.includes('number')) questionEmoji = '🔢';
        if (question.type.includes('pattern')) questionEmoji = '🔷';
        
        // Create question HTML
        const questionHtml = `
            <div class="question-container" style="animation: slideInUp 0.5s ease-out;">
                <div class="question-header">
                    <div class="question-title">
                        <span class="question-emoji">${questionEmoji}</span>
                        <div>
                            <h3>Question ${index + 1}</h3>
                            <p class="question-category">${question.category}</p>
                        </div>
                    </div>
                    <div class="question-stars">
                        ${'⭐'.repeat(question.difficulty)}
                    </div>
                </div>
                
                <div class="question-body">
                    <div class="question-text">
                        ${question.question.replace(/<br>/g, '<br>')}
                    </div>
                    
                    <div class="options-container">
                        ${optionsHtml}
                    </div>
                </div>
            </div>
        `;
        
        // Update content
        document.getElementById('test-content').innerHTML = questionHtml;
        
        // Restore previous answer
        const existingAnswer = answers.find(a => a.question_id === question.id);
        if (existingAnswer) {
            selectOption6_8(existingAnswer.option_index);
        }
        
        // Update counters
        updateCounters();
    }
    
    // Select option with fun animation
    window.selectOption6_8 = function(optionIndex) {
        // Remove selection from all options
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
            card.style.transform = 'scale(1)';
        });
        
        // Add selection to clicked option
        const selectedCard = document.querySelectorAll('.option-card')[optionIndex];
        if (selectedCard) {
            selectedCard.classList.add('selected');
            selectedCard.style.transform = 'scale(1.05)';
            
            // Add bounce animation
            selectedCard.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                selectedCard.style.animation = '';
            }, 500);
            
            // Save answer
            saveAnswer6_8(optionIndex);
            
            // Add confetti effect for selection
            createMiniConfetti();
        }
    }
    
    // Save answer
    function saveAnswer6_8(optionIndex) {
        const question = questions[currentQuestion];
        const existingIndex = answers.findIndex(a => a.question_id === question.id);
        
        const answerData = {
            question_id: question.id,
            answer: question.options[optionIndex],
            option_index: optionIndex,
            category: question.category,
            type: question.type
        };
        
        if (existingIndex > -1) {
            answers[existingIndex] = answerData;
        } else {
            answers.push(answerData);
        }
        
        updateProgress();
        updateAnsweredCount();
    }
    
    // Start timer with visual effects
    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Add warning effects when time is running low
            if (timeLeft === 5 * 60) { // 5 minutes left
                addTimeWarning();
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitTest6_8();
            }
        }, 1000);
    }
    
    // Update timer display with colors
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerElement = document.getElementById('timer');
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change colors based on time
            if (timeLeft < 5 * 60) {
                timerElement.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E8E)';
                timerElement.style.animation = 'pulse 1s infinite';
            } else if (timeLeft < 10 * 60) {
                timerElement.style.background = 'linear-gradient(135deg, #FFD166, #FFE8A0)';
            }
        }
    }
    
    // Add time warning effects
    function addTimeWarning() {
        // Add pulsing border to timer
        const timerWidget = document.querySelector('.timer-widget');
        if (timerWidget) {
            timerWidget.style.animation = 'warningPulse 0.5s infinite';
        }
        
        // Add warning message
        const warning = document.createElement('div');
        warning.className = 'time-warning';
        warning.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-clock me-2"></i>
                <strong>Time Alert!</strong> 5 minutes remaining
            </div>
        `;
        document.querySelector('.test-container').prepend(warning);
        
        // Remove after 5 seconds
        setTimeout(() => {
            warning.remove();
        }, 5000);
    }
    
    // Update progress with animation
    function updateProgress() {
        const progress = ((currentQuestion + 1) / totalQuestions) * 100;
        const progressBar = document.getElementById('progress-bar');
        
        if (progressBar) {
            gsap.to(progressBar, {
                width: `${progress}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
        
        document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
        updateProgressRing(progress);
    }
    
    // Update progress ring
    function updateProgressRing(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            gsap.to(progressFill, {
                width: `${percent}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }
    
    // Update counters
    function updateCounters() {
        document.getElementById('question-counter').textContent = 
            `Question ${currentQuestion + 1} of ${totalQuestions}`;
        document.getElementById('question-current').textContent = currentQuestion + 1;
    }
    
    // Update answered count
    function updateAnsweredCount() {
        const answeredCount = answers.length;
        document.getElementById('answers-count').textContent = answeredCount;
    }
    
    // Update navigation buttons
    function updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === totalQuestions - 1) {
            nextBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Finish Test!';
            nextBtn.className = 'nav-btn btn-success';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ms-2"></i>';
            nextBtn.className = 'nav-btn btn-primary';
        }
    }
    
    // Next question with animation
    window.nextQuestion6_8 = function() {
        if (currentQuestion < totalQuestions - 1) {
            // Slide out animation
            gsap.to('#test-content', {
                x: -100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentQuestion++;
                    displayQuestion(currentQuestion);
                    updateNavigation();
                    updateProgress();
                    
                    // Slide in animation
                    gsap.from('#test-content', {
                        x: 100,
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });
        } else {
            submitTest6_8();
        }
    }
    
    // Previous question with animation
    window.prevQuestion6_8 = function() {
        if (currentQuestion > 0) {
            // Slide out animation
            gsap.to('#test-content', {
                x: 100,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentQuestion--;
                    displayQuestion(currentQuestion);
                    updateNavigation();
                    updateProgress();
                    
                    // Slide in animation
                    gsap.from('#test-content', {
                        x: -100,
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });
        }
    }
    
    // Submit test with celebration
    async function submitTest6_8() {
        clearInterval(timerInterval);
        
        // Show celebration
        createCelebration();
        
        // Show loading with fun animation
        document.getElementById('test-content').innerHTML = `
            <div class="text-center py-5">
                <div class="loading-fun">
                    <div class="spinner"></div>
                    <div class="dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <h4 class="mt-4">Great Job! 🎉</h4>
                <p class="text-muted">Calculating your awesome score...</p>
            </div>
        `;
        
        // Disable buttons
        document.getElementById('prev-btn').disabled = true;
        document.getElementById('next-btn').disabled = true;
        
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
            showResults6_8(result);
        } catch (error) {
            showError('Oops! Something went wrong. Please try again.');
        }
    }
    
    // Show results with celebration
    function showResults6_8(result) {
        const resultContent = document.getElementById('result-content');
        
        // Determine celebration level
        let celebrationLevel = '🎉 Good Job!';
        let celebrationColor = '#4ECDC4';
        
        if (result.score >= 90) {
            celebrationLevel = '🏆 Champion! 🏆';
            celebrationColor = '#FFD166';
        } else if (result.score >= 70) {
            celebrationLevel = '🌟 Super Star! 🌟';
            celebrationColor = '#06D6A0';
        }
        
        resultContent.innerHTML = `
            <div class="result-display">
                <div class="score-circle" style="background: ${celebrationColor}">
                    <span class="score-value">${Math.round(result.score)}</span>
                    <span class="score-percent">%</span>
                </div>
                
                <h3 class="celebration-text">${celebrationLevel}</h3>
                <p class="score-detail">You got ${result.correct_answers} out of ${result.total_questions} correct!</p>
                
                <div class="result-breakdown">
                    <div class="result-item">
                        <span class="result-label">Correct Answers</span>
                        <span class="result-value">${result.correct_answers}/${result.total_questions}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Your Score</span>
                        <span class="result-value">${result.score.toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Time Used</span>
                        <span class="result-value">${formatTime((30 * 60) - timeLeft)}</span>
                    </div>
                </div>
                
                ${result.strong_points && result.strong_points.length > 0 ? `
                <div class="strengths-section">
                    <h5><i class="fas fa-thumbs-up me-2"></i> You're Great At:</h5>
                    <div class="strengths-list">
                        ${result.strong_points.map(point => `
                            <span class="strength-badge">${point}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="encouragement">
                    <p>Keep practicing and you'll keep getting better!</p>
                </div>
            </div>
        `;
        
        // Show modal with animation
        const modal = new bootstrap.Modal(document.getElementById('completion-modal'));
        modal.show();
        
        // Add more confetti
        setTimeout(createConfettiRain, 500);
    }
    
    // Add fun animations
    function addFunAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes warningPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .option-card {
                animation: optionAppear 0.5s ease-out forwards;
                opacity: 0;
            }
            
            @keyframes optionAppear {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .loading-fun {
                position: relative;
                width: 100px;
                height: 100px;
                margin: 0 auto;
            }
            
            .loading-fun .spinner {
                width: 100px;
                height: 100px;
                border: 8px solid #FF6B6B;
                border-top-color: #4ECDC4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .loading-fun .dots {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                gap: 8px;
            }
            
            .loading-fun .dots span {
                width: 12px;
                height: 12px;
                background: #FFD166;
                border-radius: 50%;
                animation: dotsBounce 1.4s infinite;
            }
            
            .loading-fun .dots span:nth-child(2) {
                animation-delay: 0.2s;
                background: #06D6A0;
            }
            
            .loading-fun .dots span:nth-child(3) {
                animation-delay: 0.4s;
                background: #118AB2;
            }
            
            @keyframes dotsBounce {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-15px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create floating emojis
    function createFloatingEmojis() {
        const emojis = ['⭐', '🎨', '🔢', '🔺', '🔷', '🐶', '🐱', '🐼', '🌈', '🎯'];
        const container = document.createElement('div');
        container.className = 'floating-emojis';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.getElementById('test-container').appendChild(container);
        
        emojis.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.textContent = emoji;
            element.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 25 + 20}px;
                opacity: ${Math.random() * 0.2 + 0.1};
                animation: floatAround ${Math.random() * 30 + 20}s linear infinite;
                animation-delay: ${index * 3}s;
            `;
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            container.appendChild(element);
        });
        
        // Add floating animation
        const floatStyle = document.createElement('style');
        floatStyle.textContent = `
            @keyframes floatAround {
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
        document.head.appendChild(floatStyle);
    }
    
    // Add bounce to elements
    function addBounceToElements() {
        document.querySelectorAll('.btn, .card, .option-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.05)';
            });
            element.addEventListener('mouseleave', () => {
                if (!element.classList.contains('selected')) {
                    element.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // Add click effects
    function addClickEffects() {
        document.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: rgba(255, 107, 107, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
            `;
            document.body.appendChild(ripple);
            
            gsap.to(ripple, {
                width: 100,
                height: 100,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
    }
    
    // Create mini confetti
    function createMiniConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
        
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 2px;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * 100}%;
                top: 20%;
            `;
            document.body.appendChild(confetti);
            
            gsap.to(confetti, {
                y: '100vh',
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: "power2.out",
                onComplete: () => confetti.remove()
            });
        }
    }
    
    // Create celebration
    function createCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-overlay';
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
        `;
        celebration.innerHTML = `
            <div class="celebration-content" style="text-align: center; color: white;">
                <h1 style="font-size: 4rem;">🎉</h1>
                <h2>You Did It!</h2>
                <p>Great job completing the test!</p>
            </div>
        `;
        document.body.appendChild(celebration);
        
        gsap.to(celebration, {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(celebration, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => celebration.remove()
                    });
                }, 2000);
            }
        });
    }
    
    // Create confetti rain
    function createConfettiRain() {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 2px;
                left: ${Math.random() * 100}%;
                top: -20px;
                pointer-events: none;
                z-index: 1000;
                transform: rotate(${Math.random() * 360}deg);
            `;
            document.body.appendChild(confetti);
            
            gsap.to(confetti, {
                y: '100vh',
                x: Math.random() * 200 - 100,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: 2 + Math.random() * 2,
                ease: "power2.out",
                onComplete: () => confetti.remove()
            });
        }
    }
    
    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Show error
    function showError(message) {
        document.getElementById('test-content').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
    
    // Add event listeners
    document.getElementById('prev-btn').addEventListener('click', window.prevQuestion6_8);
    document.getElementById('next-btn').addEventListener('click', window.nextQuestion6_8);
    
    // Initialize after short delay
    setTimeout(initializeTest, 500);
});