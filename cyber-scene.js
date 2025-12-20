// 3D Background Scene with Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas-3d'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create geometric shapes
const torusGeometry = new THREE.TorusGeometry(10, 2, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff006e,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-15, 0, -10);
scene.add(sphere);

camera.position.z = 30;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.001;
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.003;
    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.004;
    
    camera.position.x = mouseX * 5;
    camera.position.y = mouseY * 5;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


