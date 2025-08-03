// Modern Portfolio JavaScript - Computer Science Theme

// Configuration
// Update this variable with your actual resume link (can be a local file path or URL)
const resumeLink = 'https://drive.google.com/file/d/1pwCEhFHaoUHURGwV5LUb27JFV5KKAMmN/view?usp=sharing';

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');

// Function to update all resume links
function updateResumeLinks() {
    // Update all resume links by their classes
    const resumeButtons = document.querySelectorAll('.btn-resume, .resume-link, .fab-resume');
    resumeButtons.forEach(link => {
        link.href = resumeLink;
    });
}

// Initialize resume links
document.addEventListener('DOMContentLoaded', () => {
    updateResumeLinks();
    console.log('Resume links updated with:', resumeLink);
});

// Typing Animation
const typingWords = [
    'Software Engineering',
    'Machine Learning',
    'Web Development',
    'Cloud Infrastructure',
    'DevOps',
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentWord = typingWords[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        typeSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// Initialize typing animation
if (typingText) {
    setTimeout(typeWriter, 1000);
}

// Navigation
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        closeMenu();
    });
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});





// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    const fadeElements = document.querySelectorAll('.skill-category, .project-card, .achievement-card, .highlight-item, .stat-card, .tech-item');
    const slideLeftElements = document.querySelectorAll('.about-text');
    const slideRightElements = document.querySelectorAll('.about-stats');
    const scaleElements = document.querySelectorAll('.hero-content, .contact-content');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    slideLeftElements.forEach(el => {
        el.classList.add('slide-in-left');
        observer.observe(el);
    });
    
    slideRightElements.forEach(el => {
        el.classList.add('slide-in-right');
        observer.observe(el);
    });
    
    scaleElements.forEach(el => {
        el.classList.add('scale-in');
        observer.observe(el);
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // EmailJS integration
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS is loaded:', emailjs);
                console.log('Attempting to send email with data:', formData);
                
                // Use a proper template ID - you'll need to replace this with your actual template ID
                const templateId = 'template_enyb37u'; // Replace with your actual template ID
                const serviceId = 'service_axhbv46';
                
                console.log('Using service ID:', serviceId);
                console.log('Using template ID:', templateId);
                
                await emailjs.send(serviceId, templateId, {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'smehta74@asu.edu' // Add recipient email
                });
                
                console.log('Email sent successfully!');
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                // Fallback for demo - simulate email sending
                console.log('EmailJS not loaded, using demo mode');
                console.log('Form data:', formData);
                showNotification('Demo mode: Message would be sent to smehta74@asu.edu', 'info');
                contactForm.reset();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                response: error.response
            });
            
            let errorMessage = 'Email service error. Please contact me directly at smehta74@asu.edu';
            if (error.status === 400) {
                errorMessage = 'Invalid email configuration. Please check EmailJS setup.';
            } else if (error.status === 401) {
                errorMessage = 'Email service authentication failed. Please check EmailJS credentials.';
            } else if (error.status === 404) {
                errorMessage = 'Email template not found. Please check template ID.';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#00d4ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Achievement card click handlers
function academic() {
    showNotification('Academic achievements page coming soon!', 'info');
}

function Creative() {
    showNotification('Creative portfolio page coming soon!', 'info');
}

function Coding() {
    showNotification('Coding achievements page coming soon!', 'info');
}

// Parallax effect for hero section
let parallaxInitialized = false;
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled > 0) {
        parallaxInitialized = true;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    } else if (hero && parallaxInitialized && scrolled === 0) {
        // Reset transform when scrolled back to top
        hero.style.transform = 'translateY(0)';
    }
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Only apply reveal animation after page has loaded
window.addEventListener('load', () => {
    revealSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)'; // Reduced from 50px
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully! 🚀');
    
    // Handle swipe to unlock screen
    const swipeScreen = document.getElementById('swipeScreen');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    // Touch/swipe variables
    let startY = 0;
    let currentY = 0;
    let isSwiping = false;
    
    // Touch event handlers
    function handleTouchStart(e) {
        startY = e.touches[0].clientY;
        isSwiping = true;
        console.log('Touch started at:', startY);
    }
    
    function handleTouchMove(e) {
        if (!isSwiping) return;
        currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        // Visual feedback during swipe
        if (deltaY > 0) {
            swipeScreen.style.transform = `translateY(-${Math.min(deltaY * 0.5, 100)}px)`;
            swipeScreen.style.opacity = Math.max(1 - deltaY / 300, 0.3);
        }
    }
    
    function handleTouchEnd(e) {
        if (!isSwiping) return;
        isSwiping = false;
        
        const deltaY = startY - currentY;
        console.log('Swipe ended. Delta Y:', deltaY);
        
        // Check if swipe is sufficient (upward swipe of at least 80px for better usability)
        if (deltaY > 80) {
            console.log('Swipe successful! Unlocking portfolio...');
            // Start music
            if (backgroundMusic) {
                backgroundMusic.play().catch(e => console.log('Music autoplay blocked:', e));
            }
            
            // Hide swipe screen
            swipeScreen.style.opacity = '0';
            setTimeout(() => {
                swipeScreen.style.display = 'none';
                console.log('Swipe screen hidden');
            }, 500);
        } else {
            console.log('Swipe insufficient, resetting...');
            // Reset position if swipe wasn't sufficient
            swipeScreen.style.transform = 'translateY(0)';
            swipeScreen.style.opacity = '1';
            // Small delay to prevent click fallback from interfering
            setTimeout(() => {
                isSwiping = false;
            }, 100);
        }
    }
    
    // Add touch event listeners
    if (swipeScreen) {
        swipeScreen.addEventListener('touchstart', handleTouchStart, { passive: true });
        swipeScreen.addEventListener('touchmove', handleTouchMove, { passive: true });
        swipeScreen.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Add mouse support for desktop
        swipeScreen.addEventListener('mousedown', (e) => {
            startY = e.clientY;
            isSwiping = true;
            console.log('Mouse down at:', startY);
        });
        
        swipeScreen.addEventListener('mousemove', (e) => {
            if (!isSwiping) return;
            currentY = e.clientY;
            const deltaY = startY - currentY;
            
            if (deltaY > 0) {
                swipeScreen.style.transform = `translateY(-${Math.min(deltaY * 0.5, 100)}px)`;
                swipeScreen.style.opacity = Math.max(1 - deltaY / 300, 0.3);
            }
        });
        
        swipeScreen.addEventListener('mouseup', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            
            const deltaY = startY - currentY;
            console.log('Mouse swipe ended. Delta Y:', deltaY);
            
            if (deltaY > 80) {
                console.log('Mouse swipe successful! Unlocking portfolio...');
                if (backgroundMusic) {
                    backgroundMusic.play().catch(e => console.log('Music autoplay blocked:', e));
                }
                
                swipeScreen.style.opacity = '0';
                setTimeout(() => {
                    swipeScreen.style.display = 'none';
                    console.log('Swipe screen hidden');
                }, 500);
            } else {
                console.log('Mouse swipe insufficient, resetting...');
                swipeScreen.style.transform = 'translateY(0)';
                swipeScreen.style.opacity = '1';
                // Small delay to prevent click fallback from interfering
                setTimeout(() => {
                    isSwiping = false;
                }, 100);
            }
        });
        
        // Add click fallback for users who don't understand swipe
        swipeScreen.addEventListener('click', (e) => {
            // Only trigger if it's a simple click (not part of a swipe)
            if (!isSwiping) {
                console.log('Click detected, unlocking portfolio...');
                if (backgroundMusic) {
                    backgroundMusic.play().catch(e => console.log('Music autoplay blocked:', e));
                }
                
                swipeScreen.style.opacity = '0';
                setTimeout(() => {
                    swipeScreen.style.display = 'none';
                    console.log('Swipe screen hidden via click');
                }, 500);
            }
        });
    }
    
    // Pause/Play button functionality
    const pauseButton = document.getElementById('pauseButton');
    let isMusicPlaying = false;
    
    if (pauseButton && backgroundMusic) {
        // Update button state based on music status
        function updatePauseButton() {
            const icon = pauseButton.querySelector('i');
            if (backgroundMusic.paused) {
                icon.className = 'fas fa-play';
                pauseButton.title = 'Play Music';
                isMusicPlaying = false;
            } else {
                icon.className = 'fas fa-pause';
                pauseButton.title = 'Pause Music';
                isMusicPlaying = true;
            }
        }
        
        // Initialize button state
        updatePauseButton();
        
        // Add click event listener
        pauseButton.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.log('Music play failed:', e));
            } else {
                backgroundMusic.pause();
            }
            updatePauseButton();
        });
        
        // Listen for music state changes
        backgroundMusic.addEventListener('play', updatePauseButton);
        backgroundMusic.addEventListener('pause', updatePauseButton);
        backgroundMusic.addEventListener('ended', updatePauseButton);
    }
        
    // Body is already visible, no need for fade-in animation
    
    // Simple and elegant cursor trail
    let cursorTrail = [];
    const maxTrailLength = 8;
    
    document.addEventListener('mousemove', (e) => {
        cursorTrail.push({
            x: e.clientX,
            y: e.clientY,
            timestamp: Date.now()
        });
        
        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
        
        // Create simple trail dot occasionally
        if (Math.random() < 0.3) {
            const dot = document.createElement('div');
            const size = Math.random() * 4 + 2;
            
            dot.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: ${size}px;
                height: ${size}px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transform: translate(-50%, -50%);
                opacity: 0.6;
            `;
            
            document.body.appendChild(dot);
            
            // Fade out animation
            const animation = dot.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0.6
                },
                { 
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                if (dot.parentNode) {
                    document.body.removeChild(dot);
                }
            };
        }
    });
});

// Scroll to top functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can go here
}, 16)); // ~60fps
