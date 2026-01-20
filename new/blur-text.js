// BlurText Component - Vanilla JavaScript Version using GSAP

class BlurText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            text: options.text || element.textContent || 'Siddharth Mehta',
            delay: options.delay !== undefined ? options.delay : 200,
            animateBy: options.animateBy || 'words',
            direction: options.direction || 'top',
            threshold: options.threshold !== undefined ? options.threshold : 0.5,
            rootMargin: options.rootMargin || '0px',
            animationFrom: options.animationFrom,
            animationTo: options.animationTo,
            onAnimationComplete: options.onAnimationComplete,
            stepDuration: options.stepDuration !== undefined ? options.stepDuration : 0.35,
            className: options.className || ''
        };

        this.inView = false;
        this.observer = null;
        this.elements = [];
        
        this.init();
    }

    init() {
        // Set up default animation values
        const defaultFrom = this.options.direction === 'top' 
            ? { filter: 'blur(10px)', opacity: 0, y: -50 }
            : { filter: 'blur(10px)', opacity: 0, y: 50 };

        const defaultTo = [
            {
                filter: 'blur(5px)',
                opacity: 0.5,
                y: this.options.direction === 'top' ? 5 : -5
            },
            { 
                filter: 'blur(0px)', 
                opacity: 1, 
                y: 0 
            }
        ];

        this.fromSnapshot = this.options.animationFrom || defaultFrom;
        this.toSnapshots = this.options.animationTo || defaultTo;

        // Add className if provided
        if (this.options.className) {
            this.element.className = this.options.className;
        }

        // Set display style
        this.element.style.display = 'inline-block';

        // Create a single span for the entire text
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, filter, opacity';
        span.style.position = 'relative';
        span.style.zIndex = '9999';
        span.textContent = this.options.text;

        // Set initial state
        gsap.set(span, {
            filter: this.fromSnapshot.filter,
            opacity: this.fromSnapshot.opacity,
            y: this.fromSnapshot.y
        });

        this.element.appendChild(span);
        this.elements = [span];

        // Set up Intersection Observer
        this.setupObserver();
    }

    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.inView) {
                        this.inView = true;
                        this.animate();
                        this.observer.unobserve(this.element);
                    }
                });
            },
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );

        this.observer.observe(this.element);
    }

    animate() {
        // Animate the entire text as one unit
        const span = this.elements[0];
        const timeline = gsap.timeline({
            onComplete: this.options.onAnimationComplete || undefined
        });

        // Animate through each step
        this.toSnapshots.forEach((step, stepIndex) => {
            timeline.to(span, {
                filter: step.filter,
                opacity: step.opacity,
                y: step.y,
                duration: this.options.stepDuration,
                ease: 'power2.out'
            }, stepIndex * this.options.stepDuration);
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

gsap.registerPlugin(ScrollTrigger);

// Initialize BlurText for the hero section name
const name = document.getElementById("hello-world");
if (name) {
    // Ensure z-index is set (position is already fixed in CSS)
    name.style.zIndex = '9999';
    
    // Initialize BlurText animation - this creates the actual text content
    new BlurText(name, {
        text: 'SIDDHARTH MEHTA',
        delay: 200,
        animateBy: 'words',
        direction: 'top',
        threshold: 0.1,
        stepDuration: 0.5
    });
}

const aboutContainer = document.getElementById("about-name-container");

ScrollTrigger.matchMedia({
  "(min-width: 768px)": () => {
    // Ensure name element exists before creating ScrollTrigger
    if (!name || !aboutContainer) return;

    // Ensure z-index is maintained
    name.style.zIndex = '9999';
    
    let isLocked = false;

    const trigger = ScrollTrigger.create({
      trigger: "#about",
      start: "top bottom",
      end: "top center",
      scrub: true,

      onUpdate(self) {
        // Skip updates if locked (will be unlocked on scroll back)
        if (isLocked && self.progress >= 1) return;
        
        const aboutRect = aboutContainer.getBoundingClientRect();

        const targetX =
          aboutRect.left + aboutRect.width / 2 - window.innerWidth / 2;

        const targetY =
          aboutRect.top + aboutRect.height / 2 - window.innerHeight / 2;

        gsap.set(name, {
          x: targetX * self.progress,
          y: targetY * self.progress,
          scale: 1 - 0.5 * self.progress
        });
      },

      onLeave() {
        // 🔒 LOCK IT - Move to about container and lock position
        if (isLocked) return; // Already locked
        
        isLocked = true;
        
        name.style.position = "absolute";
        name.style.fontSize = "2.9rem";
        name.style.transform = "translate(-50%, -50%) scale(0.5)";
        name.style.zIndex = "9999";
        
        // Clear GSAP transforms
        gsap.set(name, {
          x: 0,
          y: 0,
          scale: 0.5,
          clearProps: "x,y"
        });

        // Move to about container
        aboutContainer.appendChild(name);
      },

      onEnterBack() {
        // 🧲 RESTORE FIXED WHEN SCROLLING UP - Unlock and restore
        if (!isLocked) return; // Already unlocked
        
        isLocked = false;
        
        const homeSection = document.getElementById("home");
        
        // Move back to home section
        homeSection.appendChild(name);

        name.style.position = "fixed";
        name.style.top = "50%";
        name.style.left = "50%";
        name.style.transform = "translate(-50%, -50%)";
        name.style.zIndex = "9999";
        name.style.fontSize = ""; // Reset font size to use CSS default
        
        // Reset GSAP transforms to allow animation to continue
        gsap.set(name, {
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "x,y"
        });
        
        // Refresh ScrollTrigger to recalculate positions
        ScrollTrigger.refresh();
      }
    });
  }
});



