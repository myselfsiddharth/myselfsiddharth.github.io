// Navbar functionality

// Smooth scroll navigation for navbar links
document.querySelectorAll('.navbar-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Handle home link (scroll to absolute top marker)
        if (targetId === '#home') {
            // Kill any existing scroll animations
            gsap.killTweensOf(window);
            gsap.killTweensOf(document.documentElement);
            gsap.killTweensOf(document.body);
            
            const startScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
            const scrollDuration = Math.min(1, Math.max(0.5, startScroll / 1000)); // Dynamic duration based on distance
            
            // Create a proxy object to animate scroll position
            const scrollProxy = { y: startScroll };
            
            // Use GSAP to animate the proxy, then update scroll position
            gsap.to(scrollProxy, {
                y: 0,
                duration: scrollDuration,
                ease: "power2.inOut",
                overwrite: true,
                onUpdate: function() {
                    // Update scroll position during animation
                    window.scrollTo(0, scrollProxy.y);
                    document.documentElement.scrollTop = scrollProxy.y;
                    document.body.scrollTop = scrollProxy.y;
                },
                onComplete: function() {
                    // Ensure we're exactly at the top
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    // Refresh ScrollTrigger after scroll completes
                    requestAnimationFrame(() => {
                        ScrollTrigger.refresh(true);
                    });
                }
            });

            return;
        }
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Use scrollIntoView for reliable scrolling
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }
    });
});

// Scroll-linked navbar animation with scrubbed timeline
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navbarContent = document.querySelector('.navbar-content');
    const navbarLinks = document.querySelector('.navbar-links');
    const navbarLinksWrapper = document.querySelector('.navbar-links-wrapper');
    const navbarBrand = document.querySelector('.navbar-brand');
    const homeSection = document.getElementById('home');

    if (!navbarContent || !homeSection || !navbarLinks || !navbarLinksWrapper || !navbarBrand || !navbar) return;

    gsap.registerPlugin(ScrollTrigger);

    // Calculate the width needed for the navbar when scrolled (links only)
    function calculateScrolledWidth() {
        // Measure each link individually to get accurate total width
        const linkElements = navbarLinks.querySelectorAll('a');
        let totalLinksWidth = 0;
        
        linkElements.forEach((link, index) => {
            const linkRect = link.getBoundingClientRect();
            totalLinksWidth += linkRect.width;
            // Add gap between links (except for last one)
            // Gap stays 30px (no animation to avoid layout thrash)
            if (index < linkElements.length - 1) {
                totalLinksWidth += 30;
            }
        });
        
        // Get padding from scrolled state (25px on each side)
        const padding = 25 + 25; // left + right
        
        // Add a small buffer to prevent overflow
        const buffer = 8;
        
        // Return total width needed
        return totalLinksWidth + padding + buffer;
    }

    // Compute center position using the FINAL state dimensions
    function getCenterXFinal() {
        const contentRect = navbarContent.getBoundingClientRect();
        const linksRect = navbarLinks.getBoundingClientRect();

        const finalPadding = 25; // matches final padding
        const finalContentWidth = scrolledWidth - finalPadding * 2;

        const linksWidth = linksRect.width;

        // Target center position inside final navbar
        const targetLeft =
            finalPadding + (finalContentWidth - linksWidth) / 2;

        const currentLeft =
            linksRect.left - contentRect.left;

        return targetLeft - currentLeft;
    }

    // Clamp helper function (safety net)
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Calculate values once after page loads
    const scrolledWidth = calculateScrolledWidth();
    
    // Hard-clamp the transform to prevent overflow
    const maxTranslateLeft = 0;
    const maxTranslateRight =
        scrolledWidth - navbarLinks.offsetWidth - 50;

    const centerX = clamp(
        getCenterXFinal(),
        maxTranslateLeft,
        maxTranslateRight
    );

    // Create scrubbed timeline - all animations happen simultaneously as you scroll
    gsap.timeline({
        scrollTrigger: {
            trigger: homeSection,
            start: "bottom bottom",
            end: "+=300",
            scrub: 1,
            invalidateOnRefresh: true
        }
    })
    .to(navbarBrand, {
        opacity: 0,
        width: 0,
        ease: "none"
    }, 0)
    .to(navbarLinks, {
        x: centerX,
        ease: "none"
    }, 0)
    .to(navbar, {
        width: scrolledWidth,
        ease: "none"
    }, 0)
    .to(navbarContent, {
        padding: "10px 25px",
        ease: "none"
    }, 0);
});

