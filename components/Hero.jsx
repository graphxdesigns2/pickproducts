"use client";

import { useEffect, useRef } from "react";
import Carousel from "@/components/Carousel";
import Link from "next/link";

export default function Hero({ onSmoothScrollTo }) {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const heroEl = heroRef.current;
    if (!canvas || !heroEl) return;
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const getParticleCount = (w, h) => Math.min(65, Math.floor((w * h) / 10000));
    const mouse = { x: null, y: null, radius: 80 };
    let dims = { w: 0, h: 0 };
    let rafId;

    function sizeCanvas() {
      const rect = heroEl.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    }

    class Particle {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update(w, h) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > w || this.x < 0) this.speedX = -this.speedX;
        if (this.y > h || this.y < 0) this.speedY = -this.speedY;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
          }
        }
      }
      draw() {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      dims = sizeCanvas();
      particlesArray = [];
      const count = getParticleCount(dims.w, dims.h);
      for (let i = 0; i < count; i++) particlesArray.push(new Particle(dims.w, dims.h));
    }

    function connect() {
      const maxDistance = 100;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.25;
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, dims.w, dims.h);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(dims.w, dims.h);
        particlesArray[i].draw();
      }
      connect();
      rafId = requestAnimationFrame(animate);
    }

    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    }
    function handleMouseOut() {
      mouse.x = null;
      mouse.y = null;
    }

    let resizeTimer;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("resize", handleResize);

    init();
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <canvas id="particle-canvas" ref={canvasRef}></canvas>
      <div className="hero-content">
        <div className="eyebrow">★ New products weekly ★</div>
        <h1>Products you're<br />looking for, <em>in one stop.</em></h1>
        <p>A fast draw means nothing if the aim is wrong. Dust settles on the living and the dead alike.</p>
        <div className="hero-cta">
  <Link href="/products" className="btn btn-gold btn-glow">
    <div className="dots_border"></div>
    <div className="btn-shine"></div>
    <span className="btn-label">Shop the Catalog</span>
    <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  </Link>

  <button className="btn btn-ghost" onClick={() => document.getElementById("support")?.scrollIntoView({ behavior: "smooth" })}>
    New items
  </button>
</div>
       
        <div className="scroll-down-wrap" onClick={() => onSmoothScrollTo("marqueeTrack", 900)}>
          <div className="scroll-down-label">Scroll</div>
          <button className="scroll-down" aria-label="Scroll down">
            <div className="dot"></div>
          </button>
        </div>
      </div>
    </section>
  );
}
