/* ========================================
   Animation and Interaction Effects Module
   ======================================== */

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupInteractiveEffects();
        this.setupNavActiveState();
    }

    /* Scroll-based animations using Intersection Observer */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section-header, .interest-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    /* Interactive hover effects */
    setupInteractiveEffects() {
        this.addRippleEffect();
        this.setupCardInteractions();
        this.setupNavigation();
    }

    /* Ripple effect on clickable elements */
    addRippleEffect() {
        const clickableElements = document.querySelectorAll(
            'a, button, .nav-link, .interest-card'
        );

        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => this.createRipple(e));
        });
    }

    createRipple(event) {
        const element = event.currentTarget;
        
        // Skip if element already has ripple processing
        if (element.classList.contains('ripple-active')) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.classList.add('ripple-active');
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
            element.classList.remove('ripple-active');
        }, 600);
    }

    /* Card interaction enhancements */
    setupCardInteractions() {
        const cards = document.querySelectorAll('.interest-card');

        cards.forEach(card => {
            // Mouse enter - parallax effect
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                // Subtle 3D rotation effect
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            // Mouse leave - reset
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });

            // Mouse move - light effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const lightX = (x / rect.width) * 100;
                const lightY = (y / rect.height) * 100;

                card.style.backgroundPosition = `${lightX}% ${lightY}%`;
            });
        });
    }

    /* Navigation active state tracking */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
            });
        });

        // Set initial active state based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /* Smooth scroll to anchor links */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

/* Utility function for adding dynamic CSS */
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Ripple effect styles */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes rippleAnimation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        /* Smooth transitions for main content */
        main {
            transition: opacity 0.2s ease-out;
        }

        /* Card background light effect preparation */
        .interest-card {
            background-size: 300% 300%;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
}

/* Initialize animations on page load */
document.addEventListener('DOMContentLoaded', () => {
    injectDynamicStyles();
    window.animationController = new AnimationController();
});

/* Handle page visibility change for performance optimization */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

