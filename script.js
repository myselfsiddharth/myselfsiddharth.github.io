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
    // Add fade-in class to elements
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .achievement-card, .highlight-item, .stat-card, .tech-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
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
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
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

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
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
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add particle trail effect to mouse
    // Add enhanced particle trail effect to mouse
    let mouseTrail = [];
    const maxTrailLength = 30;
    
    document.addEventListener('mousemove', (e) => {
        const particle = {
            x: e.clientX,
            y: e.clientY,
            timestamp: Date.now()
        };
        
        mouseTrail.push(particle);
        
        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
        
        // Create floating particles more frequently
        if (Math.random() < 0.3) {
            createFloatingParticle(e.clientX, e.clientY);
        }
        
        // Create trail particles
        createTrailParticle(e.clientX, e.clientY);
    });
    
    function createFloatingParticle(x, y) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 6; // 6-14px size
        const colors = ['#00d4ff', '#4ecdc4', '#a855f7', '#f97316', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.8;
            box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
            filter: blur(0.5px);
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle with more dramatic movement
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.8
            },
            { 
                transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 1500 + Math.random() * 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                document.body.removeChild(particle);
            }
        };
    }
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2; // 2-6px size
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, #00d4ff, #4ecdc4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.7;
            box-shadow: 0 0 ${size * 3}px rgba(0, 212, 255, 0.6);
        `;
        
        document.body.appendChild(particle);
        
        // Animate trail particle
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.7
            },
            { 
                transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                document.body.removeChild(particle);
            }
        };
    }
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
