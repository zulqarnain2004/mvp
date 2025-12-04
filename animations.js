// Age-Specific Animation Manager
class AgeAnimationManager {
    constructor(ageGroup) {
        this.ageGroup = ageGroup;
        this.init();
    }
    
    init() {
        console.log(`Initializing animations for age group: ${this.ageGroup}`);
        
        // Add age-specific class to body
        document.body.classList.add(`age-${this.ageGroup.replace('-', '-')}`);
        
        // Initialize animations based on age group
        switch(this.ageGroup) {
            case '6-8':
                this.initYoungAnimations();
                break;
            case '9-11':
                this.initMiddleAnimations();
                break;
            case '12-14':
                this.initOlderAnimations();
                break;
        }
        
        // Common animations for all age groups
        this.initCommonAnimations();
    }
    
    initYoungAnimations() {
        console.log("Initializing young animations (6-8)");
        
        // Add floating emojis
        this.createFloatingEmojis(['🎨', '🎮', '🧩', '🎯', '🌟', '🌈', '🦄', '🐱']);
        
        // Add bouncy elements
        this.makeElementsBouncy(['.card', '.btn', '.option-item']);
        
        // Add rainbow effects
        this.addRainbowEffects(['.progress-bar', '.badge']);
        
        // Create particle system
        this.createParticleSystem(30, ['#ff9a9e', '#fad0c4', '#a1c4fd', '#c2e9fb']);
    }
    
    initMiddleAnimations() {
        console.log("Initializing middle animations (9-11)");
        
        // Add dynamic elements
        this.createRotatingElements(['.card-header', '.timer']);
        
        // Add wave effects
        this.addWaveEffects(['.option-item']);
        
        // Create geometric patterns
        this.createGeometricPatterns();
        
        // Add hover transformations
        this.addHoverTransformations(['.card', '.option-item']);
    }
    
    initOlderAnimations() {
        console.log("Initializing older animations (12-14)");
        
        // Add sophisticated animations
        this.addParallaxEffect();
        
        // Create matrix effect
        this.createMatrixEffect();
        
        // Add smooth transitions
        this.addSmoothTransitions(['.card', '.option-item', '.btn']);
        
        // Create particle trails
        this.createParticleTrails();
    }
    
    initCommonAnimations() {
        // Create background particles
        this.createBackgroundParticles();
        
        // Add scroll animations
        this.addScrollAnimations();
        
        // Add click animations
        this.addClickAnimations();
        
        // Add hover sound effects (visual only)
        this.addHoverEffects();
    }
    
    createFloatingEmojis(emojis) {
        const container = document.createElement('div');
        container.className = 'floating-emojis';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(container);
        
        emojis.forEach((emoji, index) => {
            const emojiElement = document.createElement('div');
            emojiElement.textContent = emoji;
            emojiElement.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 30 + 20}px;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: floatEmoji ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${index * 2}s;
            `;
            
            // Random position
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            emojiElement.style.left = `${left}%`;
            emojiElement.style.top = `${top}%`;
            
            container.appendChild(emojiElement);
        });
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatEmoji {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
                }
                50% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
                }
                75% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    makeElementsBouncy(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    element.style.animation = 'bounce 0.5s ease';
                });
                element.addEventListener('animationend', () => {
                    element.style.animation = '';
                });
            });
        });
    }
    
    addRainbowEffects(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'];
                let currentColor = 0;
                
                setInterval(() => {
                    element.style.background = colors[currentColor];
                    currentColor = (currentColor + 1) % colors.length;
                }, 1000);
            });
        });
    }
    
    createParticleSystem(count, colors) {
        const container = document.createElement('div');
        container.className = 'particles';
        document.body.appendChild(container);
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            container.appendChild(particle);
        }
    }
    
    createRotatingElements(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    gsap.to(element, {
                        rotation: 360,
                        duration: 1,
                        ease: "power2.out"
                    });
                });
            });
        });
    }
    
    addWaveEffects(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                element.style.animation = `waveIn 0.5s ease-out ${index * 0.1}s both`;
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes waveIn {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createGeometricPatterns() {
        const patterns = ['▲', '●', '■', '◆', '★', '⬡'];
        const container = document.createElement('div');
        container.className = 'geometric-patterns';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        
        for (let i = 0; i < 20; i++) {
            const pattern = document.createElement('div');
            pattern.textContent = patterns[Math.floor(Math.random() * patterns.length)];
            pattern.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 40 + 20}px;
                color: rgba(255, 255, 255, 0.1);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: rotatePattern ${Math.random() * 20 + 10}s linear infinite;
            `;
            container.appendChild(pattern);
        }
        
        document.body.appendChild(container);
    }
    
    addHoverTransformations(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    gsap.to(element, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                });
                
                element.addEventListener('mouseleave', () => {
                    gsap.to(element, {
                        scale: 1,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                });
            });
        });
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.querySelectorAll('.parallax').forEach(element => {
                gsap.to(element, {
                    y: rate,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }
    
    createMatrixEffect() {
        const container = document.createElement('div');
        container.className = 'matrix-effect';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.05;
            overflow: hidden;
        `;
        
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                top: -100px;
                left: ${i * 20}px;
                width: 2px;
                height: 100px;
                background: linear-gradient(transparent, #0f0, transparent);
                animation: matrixFall ${Math.random() * 5 + 3}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(column);
        }
        
        document.body.appendChild(container);
    }
    
    addSmoothTransitions(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }
    
    createParticleTrails() {
        document.addEventListener('mousemove', (e) => {
            const particle = document.createElement('div');
            particle.className = 'particle-trail';
            particle.style.cssText = `
                position: fixed;
                width: 5px;
                height: 5px;
                background: rgba(102, 126, 234, 0.5);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            
            gsap.to(particle, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        });
    }
    
    createBackgroundParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            
            const size = Math.random() * 5 + 2;
            const duration = Math.random() * 20 + 10;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${duration}s linear infinite;
                z-index: -1;
            `;
            
            document.body.appendChild(particle);
        }
    }
    
    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
    
    addClickAnimations() {
        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(102, 126, 234, 0.5);
                border-radius: 50%;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(ripple);
            
            gsap.to(ripple, {
                width: 100,
                height: 100,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
    }
    
    addHoverEffects() {
        document.querySelectorAll('.hover-effect').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('animate__animated', 'animate__pulse');
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove('animate__animated', 'animate__pulse');
            });
        });
    }
    
    celebrateSuccess() {
        this.createConfetti();
        this.showCelebrationMessage();
        this.playSuccessAnimation();
    }
    
    createConfetti() {
        const confettiCount = 100;
        const colors = ['#ff9a9e', '#fad0c4', '#a1c4fd', '#c2e9fb', '#d4fc79'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const rotation = Math.random() * 360;
            const delay = Math.random() * 2;
            
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${color};
                left: ${left}%;
                top: -20px;
                transform: rotate(${rotation}deg);
                animation: confettiFall 3s linear ${delay}s forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000 + delay * 1000);
        }
    }
    
    showCelebrationMessage() {
        const messages = [
            "🎉 Excellent Work! 🎉",
            "🌟 Amazing Job! 🌟",
            "💫 You're a Star! 💫",
            "🏆 Champion! 🏆",
            "✨ Brilliant! ✨"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.textContent = message;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    
    playSuccessAnimation() {
        // Add success animation to all elements
        document.querySelectorAll('.card, .btn-success, .result-score').forEach(element => {
            element.classList.add('animate__animated', 'animate__tada');
            
            setTimeout(() => {
                element.classList.remove('animate__animated', 'animate__tada');
            }, 1000);
        });
    }
}

// Initialize animation manager based on age group
function initAgeAnimations(ageGroup) {
    return new AgeAnimationManager(ageGroup);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgeAnimationManager, initAgeAnimations };
}