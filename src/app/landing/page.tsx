"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Bot,
  Search,
  Layers,
  TrendingUp,
} from "lucide-react";

// ─────────────────────────────────────────
// 3D Neural Network Canvas
// ─────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    // Node definition
    interface Node {
      x: number; y: number; z: number;
      vx: number; vy: number;
      r: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    const NODE_COUNT = 80;
    const COLORS = ["#3D6B4F", "#4D8A64", "#B5714A", "#F2EDE4", "#7A7265", "#C49040"];
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 500 + 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    let t = 0;

    const render = () => {
      ctx.fillStyle = "rgba(14, 13, 11, 0.18)";
      ctx.fillRect(0, 0, W, H);
      t += 0.005;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update nodes
      nodes.forEach((n) => {
        n.x += n.vx + Math.sin(t + n.z * 0.01) * 0.15;
        n.y += n.vy + Math.cos(t + n.z * 0.01) * 0.15;
        n.pulse += n.pulseSpeed;

        // Mouse gravity (subtle)
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          n.x += dx * 0.0008;
          n.y += dy * 0.0008;
        }

        // Boundary wrap
        if (n.x < -50) n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50) n.y = H + 50;
        if (n.y > H + 50) n.y = -50;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(61, 107, 79, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const scale = 500 / (500 + n.z);
        const pulseFactor = 1 + Math.sin(n.pulse) * 0.25;
        const radius = n.r * scale * pulseFactor;

        // Glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
        grd.addColorStop(0, n.color + "60");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.9 * scale;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Subtle green pulse from center
      const pulseR = 200 + Math.sin(t * 2) * 30;
      const centerGrd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, pulseR);
      centerGrd.addColorStop(0, "rgba(61, 107, 79, 0.06)");
      centerGrd.addColorStop(1, "transparent");
      ctx.fillStyle = centerGrd;
      ctx.fillRect(0, 0, W, H);

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

// ─────────────────────────────────────────
// Floating feature cards
// ─────────────────────────────────────────

function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(150);
  const y = useMotionValue(150);
  const rotateX = useTransform(y, [0, 300], [5, -5]);
  const rotateY = useTransform(x, [0, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // For the spotlight CSS mask
    ref.current.style.setProperty("--mouse-x", `${mx}px`);
    ref.current.style.setProperty("--mouse-y", `${my}px`);
    
    // For Framer Motion tilt
    x.set(mx);
    y.set(my);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(150);
        y.set(150);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`glass-panel spotlight-card rounded-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
const FEATURES = [
  {
    icon: Bot,
    title: "6 AI Engines Simultaneously",
    desc: "ChatGPT, Gemini, Perplexity, Grok, Copilot & Google AI — all queried in one shot.",
    color: "#3D6B4F",
  },
  {
    icon: Search,
    title: "Visibility Gap Detection",
    desc: "Discover keywords where you rank #1 on Google but are invisible in AI answers.",
    color: "#B5714A",
  },
  {
    icon: ShieldCheck,
    title: "Hallucination Monitor",
    desc: "Detect when AI engines make false claims about your brand and product features.",
    color: "#C49040",
  },
  {
    icon: Globe,
    title: "Geographic Radar",
    desc: "Multi-region citation scanning across US, UK, EU, and India using residential proxies.",
    color: "#4D8A64",
  },
  {
    icon: BarChart3,
    title: "Competitor Benchmarking",
    desc: "See exactly why your competitors get cited and what schema structure they use.",
    color: "#B5714A",
  },
  {
    icon: Zap,
    title: "Actionable GEO Roadmap",
    desc: "Prioritized action items sorted by citation lift impact and implementation effort.",
    color: "#3D6B4F",
  },
];

// ─────────────────────────────────────────
// Engine Badge Animation
// ─────────────────────────────────────────
const ENGINES = ["ChatGPT", "Gemini", "Perplexity", "Grok", "Copilot", "Google AI"];

function EngineOrbit() {
  return (
    <div className="relative w-[300px] h-[300px] flex-shrink-0">
      {/* Center orb */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[var(--color-accent-primary)] shadow-[0_0_60px_rgba(61,107,79,0.8)] flex items-center justify-center text-white font-display italic text-xs"
      >
        AEOspy
      </motion.div>

      {/* Orbiting engine badges */}
      {ENGINES.map((eng, i) => {
        const angle = (i / ENGINES.length) * 2 * Math.PI;
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.div
            key={eng}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            animate={{
              left: [`calc(50% + ${x}px)`],
              top: [`calc(50% + ${y}px)`],
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              scale: { duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 },
              opacity: { duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 },
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 glass-panel px-2 py-1 rounded text-[10px] font-mono font-medium text-[var(--color-ink-secondary)] border border-[var(--color-accent-primary)]/30 whitespace-nowrap"
          >
            {eng}
          </motion.div>
        );
      })}

      {/* Orbit ring */}
      <div className="absolute inset-0 m-auto w-[240px] h-[240px] rounded-full border border-[var(--color-accent-primary)]/15 pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────
// Typing Headline
// ─────────────────────────────────────────
const HEADLINES = [
  "Is ChatGPT ignoring your brand?",
  "Does Gemini know you exist?",
  "Are you invisible to Perplexity?",
  "What do AI engines say about you?",
];

function TypingHeadline() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = HEADLINES[idx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < full.length) {
      timer = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === full.length) {
      timer = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((prev) => (prev + 1) % HEADLINES.length);
    }

    return () => clearTimeout(timer);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-gradient-primary">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-[var(--color-accent-primary)] ml-1 align-middle"
      />
    </span>
  );
}

// ─────────────────────────────────────────
// Scrolling stats ticker
// ─────────────────────────────────────────
const STATS = [
  { value: "6", label: "AI Engines Monitored" },
  { value: "90s", label: "Audit Completion Time" },
  { value: "4", label: "Geographic Regions" },
  { value: "100+", label: "Ranking Signals Parsed" },
  { value: "Real-time", label: "SSE Progress Streaming" },
];

// ─────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  return (
    <div className="relative min-h-screen font-body overflow-x-hidden bg-[var(--color-bg-base)]">
      <NeuralCanvas />

      {/* ── Nav ────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex justify-between items-center glass-panel border-b border-[var(--color-border-subtle)]"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary-muted)] flex items-center justify-center"
          >
            <Sparkles size={14} className="text-[var(--color-accent-primary-hover)]" />
          </motion.div>
          <div>
            <span className="font-display italic text-xl tracking-wide">AEOspy</span>
            <span className="text-[8px] font-mono text-[var(--color-ink-tertiary)] block uppercase tracking-[0.15em]">
              Answer Engine Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/history" className="text-xs font-mono text-[var(--color-ink-secondary)] hover:text-white transition px-3 py-1.5 rounded hover:bg-[var(--color-bg-raised)]">
            History
          </Link>
          <Link href="/settings" className="text-xs font-mono text-[var(--color-ink-secondary)] hover:text-white transition px-3 py-1.5 rounded hover:bg-[var(--color-bg-raised)]">
            Settings
          </Link>
          <Link
            href="/audit"
            className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-medium px-4 py-2 rounded tracking-wider transition shadow-[0_0_20px_rgba(61,107,79,0.5)] flex items-center gap-1.5"
          >
            <Sparkles size={12} /> Launch Audit
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero Section ─────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center z-10">
        <motion.div style={{ y: springY, opacity: heroOpacity }} className="flex flex-col items-center gap-8 max-w-4xl">

          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="glass-panel border border-[var(--color-accent-primary)]/40 px-4 py-1.5 rounded-full flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)]"
            />
            <span className="text-[11px] font-mono text-[var(--color-accent-primary-hover)] tracking-wider">
              Built for the Generative Search Era
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl text-[var(--color-ink-primary)] font-light leading-[1.1] tracking-tight"
          >
            <TypingHeadline />
            <br />
            <span className="text-[var(--color-ink-secondary)] font-light">Find out with </span>
            <span className="italic text-gradient-primary">AEOspy.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base text-[var(--color-ink-secondary)] max-w-xl leading-relaxed"
          >
            The first Answer Engine Optimization radar. Audit your brand's AI citation presence,
            detect hallucinations, and close the visibility gap — in 90 seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/audit">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(61,107,79,0.8)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-[var(--color-accent-primary)] text-white text-sm font-mono font-medium px-8 py-3.5 rounded-lg tracking-wider uppercase shadow-[0_0_25px_rgba(61,107,79,0.5)] flex items-center gap-2 transition-all"
              >
                <Sparkles size={16} /> Start Free Audit
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link href="/audit">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel text-[var(--color-ink-secondary)] text-sm font-mono px-8 py-3.5 rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-accent-primary)]/50 transition-all flex items-center gap-2"
              >
                View Demo →
              </motion.button>
            </Link>
          </motion.div>

          {/* Orbit visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-4"
          >
            <EngineOrbit />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-[var(--color-ink-ghost)] mt-2"
          >
            <ChevronDown size={18} />
            <span className="text-[9px] font-mono uppercase tracking-widest">Scroll</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ─────────────────────────── */}
      <section className="relative z-10 py-6 glass-panel border-y border-[var(--color-border-subtle)]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 px-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-0.5"
            >
              <span className="font-display text-3xl font-bold text-[var(--color-accent-primary)] score-text-glow">
                {stat.value}
              </span>
              <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono text-[var(--color-accent-copper)] uppercase tracking-widest">
            Platform Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[var(--color-ink-primary)] mt-3">
            Everything you need to <br />
            <span className="italic text-[var(--color-accent-primary-hover)]">own the AI answer layer.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {FEATURES.map((feat, i) => (
            <TiltCard
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 flex flex-col gap-4 cursor-default group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: feat.color + "22", border: `1px solid ${feat.color}44` }}
              >
                <feat.icon size={20} style={{ color: feat.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-ink-primary)] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── How it Works ──────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-mono text-[var(--color-accent-copper)] uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="font-display text-4xl font-light text-[var(--color-ink-primary)] mt-3">
            Three steps. <span className="italic">90 seconds.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: Search, title: "Enter Domain", desc: "Type your brand URL. Our agents scrape your homepage and detect brand signals, schema types, and entity footprint.", color: "#3D6B4F" },
            { step: "02", icon: Layers, title: "Multi-Agent Audit", desc: "Six AI engines are queried in parallel. SERP ranks are retrieved. Competitors are scraped. Hallucinations are flagged.", color: "#B5714A" },
            { step: "03", icon: TrendingUp, title: "Actionable Report", desc: "A prioritized GEO roadmap is generated. A spoken CMO briefing is narrated. You see exactly where to act.", color: "#C49040" },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col gap-4"
            >
              {i < 2 && (
                <div className="hidden md:block absolute left-full top-8 w-full h-px border-t border-dashed border-[var(--color-border-strong)] -translate-x-4 z-0" />
              )}
              <TiltCard className="p-6 flex flex-col gap-4 relative z-10 h-full">
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: step.color + "22", border: `1px solid ${step.color}44` }}
                  >
                    <step.icon size={20} style={{ color: step.color }} />
                  </div>
                  <span className="font-display text-4xl font-bold text-[var(--color-ink-ghost)]">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--color-ink-primary)] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────── */}
      <section className="relative z-10 py-24 px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl p-12 max-w-2xl w-full text-center flex flex-col items-center gap-6 border border-[var(--color-accent-primary)]/20"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-[var(--color-accent-primary-muted)] border border-[var(--color-accent-primary)] flex items-center justify-center"
          >
            <Sparkles size={28} className="text-[var(--color-accent-primary-hover)]" />
          </motion.div>
          <h2 className="font-display text-4xl font-light text-[var(--color-ink-primary)]">
            Ready to claim <span className="italic">your AI presence?</span>
          </h2>
          <p className="text-sm text-[var(--color-ink-secondary)] max-w-md">
            Enter your domain and watch 6 AI engines respond to your brand&apos;s search queries in real time.
          </p>
          <Link href="/audit">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(61,107,79,0.8)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[var(--color-accent-primary)] text-white font-mono font-medium px-10 py-4 rounded-lg tracking-wider uppercase shadow-[0_0_30px_rgba(61,107,79,0.5)] flex items-center gap-2 text-sm transition-all"
            >
              <Sparkles size={16} /> Start Your Free Audit <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="relative z-10 border-t border-[var(--color-border-subtle)] glass-panel px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[var(--color-ink-tertiary)]">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-[var(--color-accent-primary)]" />
          <span>© 2026 AEOspy — Answer Engine Optimization Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/history" className="hover:text-white transition">History</Link>
          <Link href="/settings" className="hover:text-white transition">Settings</Link>
          <Link href="/audit" className="hover:text-white transition">Audit Dashboard</Link>
        </div>
      </footer>
    </div>
  );
}
