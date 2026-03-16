'use client';

import React, { useEffect, useRef, useMemo } from 'react';

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;

    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 10, g: 14, b: 26 }; // Fade to background color
      this.colorWeight = 0;
      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;
    const direction = { x: randomX - x, y: randomY - y };
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }
    return { x: x + direction.x, y: y + direction.y };
  }
}

export default function ParticleTextEffect({ 
  words = ["AI FRAUD", "DETECTION", "WELFARE", "SCHEMES"], 
  className = "" 
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

  const pixelSteps = 4; // Higher detail
  const drawAsPoints = true;

  const generateRandomPos = (x, y, mag) => {
    const randomX = Math.random() * 1200;
    const randomY = Math.random() * 600;
    const direction = { x: randomX - x, y: randomY - y };
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }
    return { x: x + direction.x, y: y + direction.y };
  };

  const nextWord = (word, canvas) => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    // Set font size based on text length to fit single line
    let fontSize = 120;
    if (word.length > 30) fontSize = 45;
    else if (word.length > 20) fontSize = 60;
    else if (word.length > 10) fontSize = 85;

    offscreenCtx.fillStyle = "white";
    offscreenCtx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Use theme colors
    const colors = [
      { r: 0, g: 212, b: 255 }, // Neon Blue
      { r: 139, g: 92, b: 246 }, // Neon Purple
      { r: 0, g: 255, b: 136 }, // Neon Green
    ];
    const newColor = colors[wordIndexRef.current % colors.length];

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const alpha = pixels[coordIndex + 3];

      if (alpha > 128) {
        const x = (coordIndex / 4) % canvas.width;
        const y = Math.floor(coordIndex / 4 / canvas.width);

        let particle;
        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;
          particle.maxSpeed = Math.random() * 8 + 6;
          particle.maxForce = particle.maxSpeed * 0.08;
          particle.colorBlendRate = Math.random() * 0.03 + 0.01;
          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;
        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = particlesRef.current;

    // Transparency: Clear the canvas instead of filling with semi-transparent color
    // This removes trails but ensures the background elements (like ShadowOverlay) are visible
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      if (particle.isKilled) {
        if (
          particle.pos.x < -100 ||
          particle.pos.x > canvas.width + 100 ||
          particle.pos.y < -100 ||
          particle.pos.y > canvas.height + 100
        ) {
          particles.splice(i, 1);
        }
      }
    }

    if (mouseRef.current.isPressed) {
      particles.forEach((particle) => {
        const dx = particle.pos.x - mouseRef.current.x;
        const dy = particle.pos.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          particle.acc.x += Math.cos(angle) * 2;
          particle.acc.y += Math.sin(angle) * 2;
        }
      });
    }

    frameCountRef.current++;
    // reshuffle every 6 seconds if there is only one word, or advance to next word
    const interval = words.length > 1 ? 180 : 360; 
    if (frameCountRef.current % interval === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      nextWord(words[wordIndexRef.current], canvas);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth > 1200 ? 1200 : window.innerWidth;
      canvas.height = 400;
      nextWord(words[wordIndexRef.current], canvas);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    const handleMouseDown = (e) => {
      mouseRef.current.isPressed = true;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleMouseUp = () => { mouseRef.current.isPressed = false; };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center w-full min-h-[400px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="cursor-crosshair active:scale-95 transition-transform duration-300"
        style={{ width: "100%", maxWidth: "1200px", height: "auto" }}
      />
    </div>
  );
}
