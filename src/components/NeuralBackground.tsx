"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetAlpha: number;
  alpha: number;
}

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 45; // Performance optimized limit
    const connectionDistance = 115;
    
    // Mouse coords
    let mouse = { x: -1000, y: -1000, active: false };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35, // Slow, peaceful drift
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1,
          targetAlpha: Math.random() * 0.4 + 0.1,
          alpha: 0, // Fade-in effect
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initial setup
    resizeCanvas();
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Update and draw particles
      particles.forEach((p) => {
        // Soft spawn fade-in
        if (p.alpha < p.targetAlpha) {
          p.alpha += 0.01;
        }

        // Float updates
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        // Interactive cursor repulsion (push particles slightly)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 0.8;
            p.y += Math.sin(angle) * force * 0.8;
          }
        }

        // Render point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 107, 79, ${p.alpha})`; // Accent color green
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]!;
          const p2 = particles[j]!;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(242, 237, 228, ${alpha})`; // Warm white connection
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.active) {
          const p = particles[i]!;
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.15 * p.alpha;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(61, 107, 79, ${alpha})`; // Glowing green connection to cursor
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-30 w-full h-full opacity-60"
    />
  );
}
