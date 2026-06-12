// Animation Controller for AI Travel Planner

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupButtonRipples();
        this.setupHoverEffects();
    }

    setupScrollReveal() {
        var elements = document.querySelectorAll('.reveal-on-scroll, .trip-card, .stat-card, .search-box');
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        for (var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0';
            elements[i].style.transform = 'translateY(30px)';
            elements[i].style.transition = 'all 0.6s ease';
            observer.observe(elements[i]);
        }
    }

    setupButtonRipples() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.addEventListener('click', function(e) {
                var ripple = document.createElement('span');
                var rect = this.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var x = e.clientX - rect.left - size / 2;
                var y = e.clientY - rect.top - size / 2;
                
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
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                setTimeout(function() { ripple.remove(); }, 600);
            });
        }
    }

    setupHoverEffects() {
        var cards = document.querySelectorAll('.trip-card');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    }

    showConfetti() {
        for (var i = 0; i < 100; i++) {
            var confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.background = 'hsl(' + (Math.random() * 360) + ', 100%, 50%)';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'confettiFall ' + (Math.random() * 2 + 2) + 's linear forwards';
            document.body.appendChild(confetti);
            setTimeout(function(c) { return function() { c.remove(); }; }(confetti), 3000);
        }
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.3s ease';
        setTimeout(function() { element.style.animation = ''; }, 300);
    }

    pulseElement(element) {
        element.style.animation = 'pulse 0.5s ease';
        setTimeout(function() { element.style.animation = ''; }, 500);
    }
}

// Add animation styles
var style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from { transform: scale(0); opacity: 0.5; }
        to { transform: scale(4); opacity: 0; }
    }
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.animations = new AnimationController();
});