'use strict';

const { PI, cos, sin, abs, sqrt, pow, round, random, atan2 } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const floor = n => n | 0;
const rand = n => n * random();
const randIn = (min, max) => rand(max - min) + min;
const randRange = n => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return abs((t + hm) % m - hm) / (hm);
};
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

// SimplexNoise implementation
class SimplexNoise {
    constructor() {
        this.p = new Uint8Array(256);
        this.perm = new Uint8Array(512);
        this.gradP = new Array(512);
        
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.random() * 256;
        }
        
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.gradP[i] = this.grad3[i % 12];
        }
    }
    
    grad3 = [
        [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    
    noise3D(x, y, z) {
        const F3 = 1/3;
        const G3 = 1/6;
        
        let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
        
        const s = (x + y + z) * F3;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3;
        
        const x0 = x - (i - t);
        const y0 = y - (j - t);
        const z0 = z - (k - t);
        
        let i1, j1, k1;
        let i2, j2, k2;
        
        if (x0 >= y0) {
            if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
            else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
            else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
        } else {
            if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
            else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
            else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
        }
        
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3;
        const y2 = y0 - j2 + 2.0 * G3;
        const z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3;
        const y3 = y0 - 1.0 + 3.0 * G3;
        const z3 = z0 - 1.0 + 3.0 * G3;
        
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.gradP[ii + this.perm[jj + this.perm[kk]]], x0, y0, z0);
        }
        
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.gradP[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]], x1, y1, z1);
        }
        
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.gradP[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]], x2, y2, z2);
        }
        
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * this.dot(this.gradP[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]], x3, y3, z3);
        }
        
        return 32.0 * (n0 + n1 + n2 + n3);
    }
    
    dot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }
}

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

let container;
let canvas;
let ctx;
let circles;
let circleProps;
let simplex;
let baseHue;

function setup() {
    createCanvas();
    resize();
    initCircles();
    draw();
}

function initCircles() {
    circleProps = new Float32Array(circlePropsLength);
    simplex = new SimplexNoise();
    baseHue = 220;

    let i;

    for (i = 0; i < circlePropsLength; i += circlePropCount) {
        initCircle(i);
    }
}

function initCircle(i) {
    let x, y, n, t, speed, vx, vy, life, ttl, radius, hue;

    x = rand(canvas.a.width);
    y = rand(canvas.a.height);
    n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
    t = rand(TAU);
    speed = baseSpeed + rand(rangeSpeed);
    vx = speed * cos(t);
    vy = speed * sin(t);
    life = 0;
    ttl = baseTTL + rand(rangeTTL);
    radius = baseRadius + rand(rangeRadius);
    hue = baseHue + n * rangeHue;

    circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
}

function updateCircles() {
    let i;

    baseHue++;

    for (i = 0; i < circlePropsLength; i += circlePropCount) {
        updateCircle(i);
    }
}

function updateCircle(i) {
    let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
    let x, y, vx, vy, life, ttl, radius, hue;

    x = circleProps[i];
    y = circleProps[i2];
    vx = circleProps[i3];
    vy = circleProps[i4];
    life = circleProps[i5];
    ttl = circleProps[i6];
    radius = circleProps[i7];
    hue = circleProps[i8];

    drawCircle(x, y, life, ttl, radius, hue);

    life++;

    circleProps[i] = x + vx;
    circleProps[i2] = y + vy;
    circleProps[i5] = life;

    (checkBounds(x, y, radius) || life > ttl) && initCircle(i);
}

function drawCircle(x, y, life, ttl, radius, hue) {
    ctx.a.save();
    ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life,ttl)})`;
    ctx.a.beginPath();
    ctx.a.arc(x,y, radius, 0, TAU);
    ctx.a.fill();
    ctx.a.closePath();
    ctx.a.restore();
}

function checkBounds(x, y, radius) {
    return (
        x < -radius ||
        x > canvas.a.width + radius ||
        y < -radius ||
        y > canvas.a.height + radius
    );
}

function createCanvas() {
    container = document.querySelector('.content--canvas');
    canvas = {
        a: document.createElement('canvas'),
        b: document.createElement('canvas')
    };
    canvas.b.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `;
    container.appendChild(canvas.b);
    ctx = {
        a: canvas.a.getContext('2d'),
        b: canvas.b.getContext('2d')
    };
}

function resize() {
    const { innerWidth, innerHeight } = window;
    
    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;

    ctx.a.drawImage(canvas.b, 0, 0);

    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;
    
    ctx.b.drawImage(canvas.a, 0, 0);
}

function render() {
    ctx.b.save();
    ctx.b.filter = 'blur(50px)';
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
}

function draw() {
    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
    updateCircles();
    render();
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', setup);
window.addEventListener('resize', resize); 