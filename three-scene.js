// Three.js 3D Scene with Laptop and Code Elements
let scene, camera, renderer;
let shapes = [];
let particles;
let laptop;
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
let spotlight, spotlightTarget;
let animationId;
let time = 0;

// Code elements to display
const codeElements = [
    '</>',
    '{',
    '}',
    '[ ]',
    '( )',
    ';',
    '&&',
    '||',
    '!=',
    '===',
    '=>',
    'if',
    'for',
    'while',
    'const',
    'let',
    'var',
    'function',
    'return',
    'class',
    'import',
    'export',
    'async',
    'await',
    'try',
    'catch',
    'console.log()',
    'git commit',
    'npm install',
    'sudo',
    'def',
    'print()',
    'lambda',
    'SELECT',
    'FROM',
    'WHERE',
    '//TODO',
    '/* */',
    '<?php',
    '<div>',
    '<script>',
    'API',
    'JSON',
    'HTTP',
    'GET',
    'POST',
    '404',
    '200',
    'null',
    'undefined',
    'true',
    'false',
    '0x',
    '127.0.0.1',
    'localhost',
    '.env',
    'README.md'
];

// Function to create text sprite
function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 512;
    canvas.height = 256;
    
    // Set font and measure text
    const fontSize = Math.min(100, 300 / text.length);
    context.font = `bold ${fontSize}px 'Courier New', monospace`;
    context.fillStyle = 'rgba(168, 218, 220, 0.9)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add glow effect
    context.shadowBlur = 20;
    context.shadowColor = '#a8dadc';
    
    // Draw text
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    
    // Scale based on text length
    const scale = Math.max(2, 5 - text.length * 0.1);
    sprite.scale.set(scale, scale / 2, 1);
    
    return sprite;
}

// Create circular texture for stars
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(168, 218, 220, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
}

// Initialize 3D Scene
function init3DScene() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found!');
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 20, 60);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 15;
    camera.position.y = 0;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1d3557, 0.3);
    scene.add(ambientLight);

    // Spotlight following mouse
    spotlight = new THREE.SpotLight(0xa8dadc, 3);
    spotlight.position.set(0, 0, 20);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    spotlight.distance = 50;
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);

    // Spotlight target
    spotlightTarget = new THREE.Object3D();
    scene.add(spotlightTarget);
    spotlight.target = spotlightTarget;

    // Additional accent lights
    const pointLight1 = new THREE.PointLight(0x457b9d, 0.8, 30);
    pointLight1.position.set(-10, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1d3557, 0.6, 30);
    pointLight2.position.set(10, -5, 5);
    scene.add(pointLight2);

    // Create floating code elements
    for (let i = 0; i < 50; i++) {
        const text = codeElements[Math.floor(Math.random() * codeElements.length)];
        const sprite = createTextSprite(text);
        
        sprite.position.x = (Math.random() - 0.5) * 50;
        sprite.position.y = (Math.random() - 0.5) * 50;
        sprite.position.z = (Math.random() - 0.5) * 50;
        
        sprite.userData = {
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            floatSpeed: Math.random() * 0.01 + 0.005,
            floatOffset: Math.random() * Math.PI * 2,
            driftSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02
            }
        };
        
        shapes.push(sprite);
        scene.add(sprite);
    }

    // Create 3D Laptop
    laptop = new THREE.Group();

    // Laptop base (keyboard)
    const baseGeometry = new THREE.BoxGeometry(8, 0.3, 5);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.8,
        roughness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -2;
    base.castShadow = true;
    laptop.add(base);

    // Keyboard details
    const keyboardGeometry = new THREE.BoxGeometry(7, 0.05, 4);
    const keyboardMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.7
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.y = -1.85;
    keyboard.position.z = 0.3;
    laptop.add(keyboard);

    // Laptop screen (back panel)
    const screenBackGeometry = new THREE.BoxGeometry(8, 5, 0.2);
    const screenBackMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        metalness: 0.8,
        roughness: 0.2
    });
    const screenBack = new THREE.Mesh(screenBackGeometry, screenBackMaterial);
    screenBack.position.y = 0.5;
    screenBack.position.z = -2.3;
    screenBack.rotation.x = -0.2;
    screenBack.castShadow = true;
    laptop.add(screenBack);

    // Laptop screen (display)
    const screenGeometry = new THREE.BoxGeometry(7.5, 4.5, 0.1);
    
    // Create canvas for screen content
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 768;
    const screenContext = screenCanvas.getContext('2d');
    
    // Draw screen background (dark with gradient)
    const gradient = screenContext.createLinearGradient(0, 0, 0, screenCanvas.height);
    gradient.addColorStop(0, '#0a192f');
    gradient.addColorStop(1, '#1d3557');
    screenContext.fillStyle = gradient;
    screenContext.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
    
    // Draw name on screen
    screenContext.font = 'bold 80px "Courier New", monospace';
    screenContext.fillStyle = '#a8dadc';
    screenContext.textAlign = 'center';
    screenContext.textBaseline = 'middle';
    screenContext.shadowBlur = 30;
    screenContext.shadowColor = '#a8dadc';
    screenContext.fillText('SIDDHARTH', screenCanvas.width / 2, screenCanvas.height / 2 - 50);
    screenContext.fillText('MEHTA', screenCanvas.width / 2, screenCanvas.height / 2 + 50);
    
    // Add terminal-like details
    screenContext.font = '24px "Courier New", monospace';
    screenContext.fillStyle = '#457b9d';
    screenContext.shadowBlur = 10;
    screenContext.fillText('> Portfolio_v2.0', 100, 100);
    screenContext.fillText('> Status: Online', 100, 140);
    
    // Add some code lines
    screenContext.font = '20px "Courier New", monospace';
    screenContext.fillStyle = '#64b5f6';
    screenContext.shadowBlur = 5;
    screenContext.fillText('$ npm run dev', 100, screenCanvas.height - 100);
    screenContext.fillStyle = '#81c784';
    screenContext.fillText('✓ Server running...', 100, screenCanvas.height - 60);
    
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMaterial = new THREE.MeshStandardMaterial({
        map: screenTexture,
        emissive: 0x1d3557,
        emissiveIntensity: 0.5
    });
    
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 0.5;
    screen.position.z = -2.2;
    screen.rotation.x = -0.2;
    laptop.add(screen);

    // Screen glow/light
    const screenLight = new THREE.PointLight(0xa8dadc, 1.5, 10);
    screenLight.position.set(0, 0.5, -2);
    laptop.add(screenLight);

    // Position laptop in scene - make sure it's visible
    laptop.position.set(0, 0, 5);
    laptop.rotation.y = 0;
    
    // Add floating animation data
    laptop.userData = {
        floatSpeed: 0.003,
        floatOffset: 0,
        rotateSpeed: 0.002
    };
    
    scene.add(laptop);

    // Particle system - Stars in space
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
        sizes[i] = Math.random() * 3 + 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        map: createCircleTexture()
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Start animation
    animate();
}

// Mouse move handler
function onMouseMove(event) {
    targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Window resize handler
function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (!scene || !camera || !renderer) return;
    
    time += 0.01;

    // Smooth mouse follow
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    // Update spotlight position
    if (spotlightTarget) {
        spotlightTarget.position.x = mouse.x * 10;
        spotlightTarget.position.y = mouse.y * 10;
        spotlightTarget.position.z = 0;
    }

    // Animate laptop
    if (laptop) {
        laptop.position.y = Math.sin(time * laptop.userData.floatSpeed) * 0.5;
        laptop.rotation.y = Math.sin(time * laptop.userData.rotateSpeed) * 0.3 + Math.PI * 0.1;
    }

    // Animate shapes
    shapes.forEach((shape) => {
        if (!shape.userData) return;
        
        // Handle rotation for sprites (text)
        if (shape instanceof THREE.Sprite && shape.userData.rotationSpeed) {
            shape.material.rotation += shape.userData.rotationSpeed;
        }

        // Float animation
        shape.position.y += Math.sin(time + shape.userData.floatOffset) * shape.userData.floatSpeed;

        // Drift animation for sprites
        if (shape.userData.driftSpeed) {
            shape.position.x += shape.userData.driftSpeed.x;
            shape.position.y += shape.userData.driftSpeed.y;
            
            // Wrap around if they go too far
            if (Math.abs(shape.position.x) > 30) shape.position.x *= -0.8;
            if (Math.abs(shape.position.y) > 30) shape.position.y *= -0.8;
            if (Math.abs(shape.position.z) > 30) shape.position.z *= -0.8;
        }

        // Subtle opacity change based on mouse position
        const distanceToMouse = Math.sqrt(
            Math.pow(shape.position.x - mouse.x * 10, 2) +
            Math.pow(shape.position.y - mouse.y * 10, 2)
        );
        
        // For sprites (text)
        if (shape instanceof THREE.Sprite) {
            shape.material.opacity = Math.max(0.4, Math.min(1, 1.2 - distanceToMouse / 25));
        }
    });

    // Rotate particles
    if (particles) {
        particles.rotation.y += 0.0005;
    }

    // Animate camera slightly
    if (camera) {
        camera.position.x = mouse.x * 2;
        camera.position.y = mouse.y * 2;
        camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
}

// Performance optimization: pause animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        animate();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DScene);
} else {
    init3DScene();
}
