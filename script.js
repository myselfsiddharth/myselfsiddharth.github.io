// Scroll progress bar
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / height) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip the resume button
    if (anchor.id === 'resume-btn') return;
    
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if href is just '#' or empty
        if (!href || href === '#' || href.length <= 1) return;
        
        try {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (error) {
            // Invalid selector, just prevent default
            e.preventDefault();
        }
    });
});

// Easter Egg 1: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.classList.add('konami-active');
        showAchievement('Code Master', 'You found the Konami Code! 🎮');
        setTimeout(() => {
            document.body.classList.remove('konami-active');
        }, 5000);
    }
});

// Easter Egg 2: Click logo 5 times for Matrix effect
let logoClicks = 0;
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        logoClicks++;
        if (logoClicks === 5) {
            activateMatrixRain();
            showAchievement('Neo Mode', 'Welcome to the Matrix! 🕶️');
            logoClicks = 0;
        }
    });
}

// Easter Egg 3: Type "secret" anywhere
let typedKeys = '';
document.addEventListener('keypress', (e) => {
    typedKeys += e.key;
    if (typedKeys.includes('secret')) {
        showAchievement('Secret Finder', 'You discovered a hidden secret! 🔍');
        document.body.style.animation = 'rainbow-bg 2s linear 3';
        typedKeys = '';
    }
    if (typedKeys.length > 10) typedKeys = typedKeys.slice(-10);
});

// Matrix Rain Effect
function activateMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.classList.add('active');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frameCount = 0;
    const maxFrames = 300;
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f3ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(draw);
        } else {
            canvas.classList.remove('active');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    draw();
}

// Show achievement notification
function showAchievement(title, text) {
    const achievement = document.getElementById('achievement');
    const achievementText = document.getElementById('achievementText');
    
    if (!achievement || !achievementText) return;
    
    achievement.querySelector('h4').textContent = '🏆 ' + title;
    achievementText.textContent = text;
    
    achievement.classList.add('show');
    
    setTimeout(() => {
        achievement.classList.remove('show');
    }, 4000);
}

// Show easter egg hint after 10 seconds
setTimeout(() => {
    const hint = document.getElementById('easterEggHint');
    if (hint) {
        hint.classList.add('show');
        setTimeout(() => {
            hint.classList.remove('show');
        }, 10000);
    }
}, 10000);

// Easter Egg 4: Double-click any skill tag for animation
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('dblclick', () => {
        tag.style.animation = 'glitch 0.5s infinite';
        setTimeout(() => {
            tag.style.animation = '';
        }, 2000);
    });
});



// Project Category Filter - Instant show/hide
const categoryButtons = document.querySelectorAll('.category-btn');
const projectCards = document.querySelectorAll('.project-card');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        // Simply show/hide cards instantly based on category
        projectCards.forEach(card => {
            const cardCategories = card.getAttribute('data-category').split(' ');
            const shouldShow = category === 'all' || cardCategories.includes(category);
            
            // Remove any animation classes and reset styles
            card.classList.remove('filtering-in', 'hiding');
            card.style.opacity = '';
            card.style.transform = '';
            card.style.display = '';
            card.style.transition = '';
            
            // Show or hide instantly
            if (shouldShow) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Custom cursor follow
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('body::before');
    // Cursor is handled via CSS
});

// Resume Modal
function initResumeModal() {
    const resumeBtn = document.getElementById('resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeModalOverlay = document.querySelector('.resume-modal-overlay');

    if (!resumeBtn || !resumeModal) {
        console.error('Resume modal elements not found');
        return;
    }

    function openResumeModal() {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeResumeModal() {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openResumeModal();
    });

    if (resumeModalClose) {
        resumeModalClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeResumeModal();
        });
    }

    if (resumeModalOverlay) {
        resumeModalOverlay.addEventListener('click', closeResumeModal);
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initResumeModal();
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
} else {
    initResumeModal();
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
