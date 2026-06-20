import { useEffect, useRef } from "react";

// Lightweight canvas particle system simulating floating spice dust
// colors: array of hex
export default function SpiceParticles({ density = 60, colors = ["#FFB300", "#E53935", "#827717", "#D4AF37"], className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const rect = canvas.getBoundingClientRect();
      particles = Array.from({ length: density }).map(() => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.1 - Math.random() * 0.4,
        a: 0.15 + Math.random() * 0.5,
        c: colors[Math.floor(Math.random() * colors.length)],
        drift: Math.random() * Math.PI * 2,
      }));
    };

    const tick = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      particles.forEach(p => {
        p.drift += 0.01;
        p.x += p.vx + Math.sin(p.drift) * 0.15;
        p.y += p.vy;
        if (p.y < -10) { p.y = rect.height + 10; p.x = Math.random() * rect.width; }
        if (p.x < -10) p.x = rect.width + 10;
        if (p.x > rect.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // soft glow
        ctx.globalAlpha = p.a * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    spawn();
    tick();
    window.addEventListener("resize", () => { resize(); spawn(); });
    return () => cancelAnimationFrame(raf);
  }, [density, colors]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} />;
}
