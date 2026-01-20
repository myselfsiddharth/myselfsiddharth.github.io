// About section animations - scroll-linked
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    
    const aboutSection = document.getElementById('about');
    const introText = document.querySelector('.about-text');
    const skillsHighlight = document.querySelector('.skills-highlight');
    
    if (!aboutSection || !introText || !skillsHighlight) return;
    
    // Set initial states
    gsap.set(introText, {
        x: -500,
        opacity: 0
    });
    
    gsap.set(skillsHighlight, {
        x: 500,
        opacity: 0
    });
    
    // Create scrubbed animation for intro text (from left)
    gsap.to(introText, {
        x: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: aboutSection,
            start: "top 80%",
            end: "top 40%",
            scrub: 1
        }
    });
    
    // Create scrubbed animation for skills highlight (from right)
    gsap.to(skillsHighlight, {
        x: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: aboutSection,
            start: "top 80%",
            end: "top 40%",
            scrub: 1
        }
    });
});

