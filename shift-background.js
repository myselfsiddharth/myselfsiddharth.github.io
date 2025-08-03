'use strict';

// Simple tech-themed background with matrix rain and circuit patterns
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const backgroundColor = '#0a0a0a';
const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const techSymbols = ['⚡', '🔌', '💻', '🖥️', '📱', '🌐', '🔋', '⚙️', '🔧', '📡', '🛰️', '🚀', '💾', '🖱️', '⌨️', '🖨️'];
const hexChars = '0123456789ABCDEF';

// Matrix rain drops
let matrixDrops = [];
// Tech particles
let techParticles = [];
// Circuit nodes
let circuitNodes = [];

function init() {
    // Setup canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    // Add canvas to the content--canvas div
    const container = document.querySelector('.content--canvas');
    if (container) {
        container.appendChild(canvas);
    } else {
        document.body.appendChild(canvas);
    }
    
    resize();
    initMatrixRain();
    initTechParticles();
    initCircuitNodes();
    animate();
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initMatrixRain() {
    matrixDrops = [];
    const dropCount = Math.floor(canvas.width / 20);
    
    for (let i = 0; i < dropCount; i++) {
        matrixDrops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 1 + Math.random() * 2,
            length: 10 + Math.random() * 20,
            chars: [],
            alpha: 0.3 + Math.random() * 0.7
        });
        
        // Initialize characters for this drop
        for (let j = 0; j < matrixDrops[i].length; j++) {
            matrixDrops[i].chars.push({
                char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
                alpha: 1 - (j / matrixDrops[i].length)
            });
        }
    }
}

function initTechParticles() {
    techParticles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        techParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            symbol: techSymbols[Math.floor(Math.random() * techSymbols.length)],
            size: 12 + Math.random() * 16,
            alpha: 0.2 + Math.random() * 0.6,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        });
    }
}

function initCircuitNodes() {
    circuitNodes = [];
    const nodeCount = 15;
    
    for (let i = 0; i < nodeCount; i++) {
        circuitNodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 4,
            pulse: Math.random() * Math.PI * 2,
            connections: []
        });
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < circuitNodes.length; i++) {
        for (let j = i + 1; j < circuitNodes.length; j++) {
            const distance = Math.sqrt(
                Math.pow(circuitNodes[i].x - circuitNodes[j].x, 2) +
                Math.pow(circuitNodes[i].y - circuitNodes[j].y, 2)
            );
            if (distance < 150) {
                circuitNodes[i].connections.push(j);
            }
        }
    }
}

function updateMatrixRain() {
    matrixDrops.forEach(drop => {
        drop.y += drop.speed;
        
        // Reset drop when it goes off screen
        if (drop.y > canvas.height + drop.length * 20) {
            drop.y = -drop.length * 20;
            drop.x = Math.random() * canvas.width;
            
            // Regenerate characters
            drop.chars.forEach(char => {
                char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            });
        }
        
        // Update character alphas
        drop.chars.forEach((char, index) => {
            char.alpha = 1 - (index / drop.length);
        });
    });
}

function updateTechParticles() {
    techParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    });
}

function updateCircuitNodes() {
    circuitNodes.forEach(node => {
        node.pulse += 0.05;
        if (node.pulse > Math.PI * 2) node.pulse = 0;
    });
}

function drawMatrixRain() {
    ctx.save();
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    
    matrixDrops.forEach(drop => {
        drop.chars.forEach((char, index) => {
            const y = drop.y - index * 20;
            if (y > -20 && y < canvas.height + 20) {
                ctx.fillStyle = `rgba(0, 255, 100, ${char.alpha * drop.alpha})`;
                ctx.fillText(char.char, drop.x, y);
            }
        });
    });
    
    ctx.restore();
}

function drawTechParticles() {
    techParticles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        ctx.fillStyle = `rgba(255, 255, 0, ${particle.alpha})`;
        ctx.font = `${particle.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.symbol, 0, 0);
        
        ctx.restore();
    });
}

function drawCircuitNodes() {
    ctx.save();
    
    // Draw connections
    circuitNodes.forEach((node, i) => {
        node.connections.forEach(j => {
            const otherNode = circuitNodes[j];
            const pulseAlpha = 0.3 + 0.2 * Math.sin(node.pulse);
            
            ctx.strokeStyle = `rgba(0, 150, 255, ${pulseAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
        });
    });
    
    // Draw nodes
    circuitNodes.forEach(node => {
        const pulseAlpha = 0.5 + 0.5 * Math.sin(node.pulse);
        
        ctx.fillStyle = `rgba(0, 150, 255, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw outer glow
        ctx.strokeStyle = `rgba(0, 150, 255, ${pulseAlpha * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    ctx.restore();
}

function animate() {
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw
    updateMatrixRain();
    updateTechParticles();
    updateCircuitNodes();
    
    drawMatrixRain();
    drawTechParticles();
    drawCircuitNodes();
    
    requestAnimationFrame(animate);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle window resize
window.addEventListener('resize', resize); 