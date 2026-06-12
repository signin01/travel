// ========================================
// AI TRAVEL PLANNER - ANIMATION CONTROLLER
// ========================================

class AnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupHoverEffects();
        this.setupButtonRipples();
    }

    // Scroll Reveal Animation
    setupScrollReveal() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Button Ripple Effect
    setupButtonRipples() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                    animation: ripple 0.6s linear forwards;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Hover Effects
    setupHoverEffects() {
        document.querySelectorAll('.trip-card, .search-box').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-10px)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0)';
            });
        });
    }

    // Confetti Effect
    showConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.setProperty('--confetti-color', `hsl(${Math.random() * 360}, 100%, 50%)`);
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Typewriter Effect
    async typeWriter(element, text, speed = 50) {
        element.innerHTML = '';
        element.classList.add('typing-effect');
        
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await this.sleep(speed);
        }
        
        element.classList.remove('typing-effect');
    }

    // Loading Spinner
    showLoading(button) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;display:inline-block;margin-right:10px;"></div> Loading...';
        button.style.opacity = '0.7';
        return () => {
            button.disabled = false;
            button.innerHTML = originalText;
            button.style.opacity = '1';
        };
    }

    // Progress Bar Animation
    animateProgressBar(element, targetPercent, duration = 1000) {
        let start = 0;
        const step = (targetPercent / duration) * 16;
        
        const interval = setInterval(() => {
            start += step;
            if (start >= targetPercent) {
                start = targetPercent;
                clearInterval(interval);
            }
            element.style.width = start + '%';
            element.textContent = Math.floor(start) + '%';
        }, 16);
    }

    // Shake on Error
    shakeElement(element) {
        element.classList.add('animate-shake');
        setTimeout(() => element.classList.remove('animate-shake'), 500);
    }

    // Pulse Effect
    pulseElement(element) {
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 500);
    }

    // Page Transition
    async transitionPage(newPageUrl) {
        document.body.style.animation = 'pageExit 0.3s ease forwards';
        await this.sleep(300);
        window.location.href = newPageUrl;
    }

    // Number Counter Animation
    animateNumber(element, target, duration = 1000) {
        let start = 0;
        const step = (target / duration) * 16;
        
        const interval = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(interval);
            }
            element.textContent = Math.floor(start);
        }, 16);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize animations when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new AnimationController();
    
    // Add reveal class to elements
    document.querySelectorAll('.trip-card, .search-box, h1, h2').forEach(el => {
        el.classList.add('reveal-on-scroll');
    });
});