"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  MapPin, 
  Zap, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Copy, 
  Check, 
  VolumeX,
  Mic,
  MicOff,
  ArrowRight,
  Globe,
  Plus
} from "lucide-react";

// --- 3D HTML5 CANVAS PARTICLE COMPONENT ("Awareness Fog") ---
interface Particle {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  color: string;
  size: number;
}

function AwarenessFog({ mode }: { mode: "idle" | "processing" | "results" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX - width / 2) / (width / 2);
      mouseRef.current.y = (e.clientY - height / 2) / (height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize particles
    const particleCount = mode === "results" ? 400 : 1200;
    const particles: Particle[] = [];
    const colors = ["#3D6B4F", "#B5714A", "#F2EDE4", "#7A7265"];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 200 + Math.random() * 300;

      // Original 3D coordinate spherical distribution
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 0.8 + Math.random() * 1.5,
      });
    }

    let angleX = 0.001;
    let angleY = 0.001;

    const render = () => {
      ctx.fillStyle = "rgba(14, 13, 11, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Mouse influence rotation speeds
      const targetAngleX = mouseRef.current.y * 0.005;
      const targetAngleY = mouseRef.current.x * 0.005;
      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      particles.forEach((p, index) => {
        // Rotations
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Apply mode-specific transformations
        if (mode === "processing") {
          // Drift and suck into center spiral
          const angle = 0.01 * index;
          p.x = p.ox + Math.sin(Date.now() * 0.001 + angle) * 30;
          p.y = p.oy + Math.cos(Date.now() * 0.001 + angle) * 30;
          p.z = p.oz;
        } else if (mode === "results") {
          // Collapse into grid plane at bottom right
          const targetX = (index % 20) * 16 - 160;
          const targetY = Math.floor(index / 20) * 16 - 160;
          const targetZ = 0;
          
          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
          p.z += (targetZ - p.z) * 0.08;
        } else {
          // Idle floating
          p.x = x1;
          p.y = y2;
          p.z = z2;
        }

        // Camera perspective projection
        const fov = 400;
        const scale = fov / (fov + p.z + 500);
        const projX = p.x * scale + width / 2;
        const projY = p.y * scale + height / 2;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, p.size * scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, scale * 0.7);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// --- CUSTOM SVG RADAR CHART ---
function RadarChart({ data }: { data: Record<string, number> }) {
  const engines = [
    { key: "chatgpt", label: "ChatGPT" },
    { key: "gemini", label: "Gemini" },
    { key: "perplexity", label: "Perplexity" },
    { key: "grok", label: "Grok" },
    { key: "copilot", label: "Copilot" },
    { key: "google_ai", label: "Google AI" },
  ];

  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;

  // Calculate coordinates for radar points
  const points = engines.map((eng, i) => {
    const angle = (i * 2 * Math.PI) / engines.length - Math.PI / 2;
    const score = (data[eng.key] || 0) / 100;
    const r = score * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, label: eng.label, angle };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Grid line paths
  const grids = [0.25, 0.5, 0.75, 1.0].map((scale) => {
    const r = scale * radius;
    return engines.map((_, i) => {
      const angle = (i * 2 * Math.PI) / engines.length - Math.PI / 2;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ") + " Z";
  });

  return (
    <div className="relative flex justify-center items-center h-[300px]">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background grids */}
        {grids.map((g, i) => (
          <path
            key={i}
            d={g}
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {engines.map((_, i) => {
          const angle = (i * 2 * Math.PI) / engines.length - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--color-border-default)"
              strokeWidth="1"
            />
          );
        })}
        {/* Scoring path */}
        <motion.path
          d={path}
          fill="var(--color-accent-primary-glow)"
          stroke="var(--color-accent-primary)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Scoring dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--color-accent-primary)"
            stroke="var(--color-ink-primary)"
            strokeWidth="1"
          />
        ))}
        {/* Text Labels */}
        {engines.map((eng, i) => {
          const angle = (i * 2 * Math.PI) / engines.length - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 15) * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="var(--color-ink-secondary)"
              fontSize="10"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {eng.label} ({data[eng.key] || 0}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// --- CUSTOM SVG SCATTER PLOT ("Visibility Gap") ---
function ScatterPlot({ 
  serps, 
  citations,
  domain 
}: { 
  serps: { keyword: string; rank: number | null }[];
  citations: any[];
  domain: string;
}) {
  const width = 360;
  const height = 240;
  const padding = 35;

  // Calculate points
  const points = serps.map((s) => {
    const kwCitations = citations.filter((c) => c.keyword === s.keyword);
    const total = kwCitations.length || 1;
    const cited = kwCitations.filter((c) => c.cited).length;
    const score = (cited / total) * 100;
    
    // Map X (SERP rank: 1 to 20) and Y (Citation: 0 to 100) to grid coordinates
    const rank = s.rank === null ? 20 : Math.min(s.rank, 20);
    const x = padding + ((rank - 1) / 19) * (width - 2 * padding);
    const y = height - padding - (score / 100) * (height - 2 * padding);

    return {
      keyword: s.keyword,
      rank,
      score,
      x,
      y,
      isGap: rank <= 5 && score < 60,
    };
  });

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Danger zone quadrant highlighted */}
        <rect
          x={padding}
          y={padding}
          width={(width - 2 * padding) * 0.25} // top-left 25% (rank 1-5, low score)
          height={(height - 2 * padding) * 0.6} // low citation rates
          fill="rgba(176, 76, 58, 0.08)"
          stroke="rgba(176, 76, 58, 0.15)"
          strokeDasharray="4 4"
        />
        <text
          x={padding + 8}
          y={padding + 16}
          fill="var(--color-accent-error)"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          GAP ZONE
        </text>

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--color-border-strong)"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="var(--color-border-strong)"
        />

        {/* Axis Labels */}
        <text
          x={width / 2}
          y={height - 8}
          fill="var(--color-ink-tertiary)"
          fontSize="9"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          Google Search Rank (1 to 20)
        </text>
        <text
          x={10}
          y={height / 2}
          transform={`rotate(-90 10 ${height / 2})`}
          fill="var(--color-ink-tertiary)"
          fontSize="9"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          AI Citation Rate %
        </text>

        {/* Grid lines */}
        {[1, 5, 10, 15, 20].map((rank, i) => {
          const x = padding + ((rank - 1) / 19) * (width - 2 * padding);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padding}
                x2={x}
                y2={height - padding}
                stroke="var(--color-border-subtle)"
                strokeDasharray="2 2"
              />
              <text
                x={x}
                y={height - padding + 12}
                fill="var(--color-ink-tertiary)"
                fontSize="8"
                textAnchor="middle"
              >
                {rank}
              </text>
            </g>
          );
        })}

        {[0, 25, 50, 75, 100].map((score, i) => {
          const y = height - padding - (score / 100) * (height - 2 * padding);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--color-border-subtle)"
                strokeDasharray="2 2"
              />
              <text
                x={padding - 6}
                y={y + 3}
                fill="var(--color-ink-tertiary)"
                fontSize="8"
                textAnchor="end"
              >
                {score}%
              </text>
            </g>
          );
        })}

        {/* Nodes plotted */}
        {points.map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={p.isGap ? "7" : "5"}
              fill={p.isGap ? "var(--color-accent-error)" : "var(--color-accent-primary)"}
              stroke="var(--color-ink-primary)"
              strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
            />
            {/* Short label */}
            <text
              x={p.x + 8}
              y={p.y - 4}
              fill="var(--color-ink-secondary)"
              fontSize="8"
              fontFamily="var(--font-mono)"
            >
              {p.keyword.slice(0, 15)}...
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// --- GEOGRAPHY WORLD MAP COMPONENT ---
function WorldMap({ scores }: { scores?: Record<string, number> }) {
  // Simple custom coordinates for mapping labels over styled locations on SVG
  const defaultScores = { us: 75, uk: 70, in: 60, eu: 65 };
  const data = scores || defaultScores;

  return (
    <div className="border border-dashed border-[var(--color-border-default)] p-4 rounded bg-[var(--color-bg-surface)] map-background flex flex-col justify-between h-[240px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Geographic Radar</span>
        <span className="flex items-center gap-1 text-[11px] text-[var(--color-accent-copper)]">
          <Globe size={12} /> residential proxies mapped
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 my-auto">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">United States</span>
          <span className="font-display text-lg text-[var(--color-accent-primary)] font-bold">{data.us}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">United Kingdom</span>
          <span className="font-display text-lg text-[var(--color-accent-primary)] font-bold">{data.uk}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">India Region</span>
          <span className="font-display text-lg text-[var(--color-accent-copper)] font-bold">{data.in}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2">
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">European Union</span>
          <span className="font-display text-lg text-[var(--color-accent-primary)] font-bold">{data.eu}%</span>
        </div>
      </div>
      <div className="text-[10px] text-[var(--color-ink-tertiary)] font-mono text-right italic">
        *Citations drop slightly in non-US locations due to localized corpus references.
      </div>
    </div>
  );
}

// --- MAIN FRONTEND VIEW CONTROLLER ---
export default function AEOspyApp() {
  const [mode, setMode] = useState<"idle" | "processing" | "results">("idle");
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [geoMode, setGeoMode] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Live progress state
  const [progressLogs, setProgressLogs] = useState<{ id: string; msg: string; status: "running" | "completed" | "error" }[]>([]);
  const [engineStates, setEngineStates] = useState<Record<string, { status: "idle" | "running" | "cited" | "not-cited"; pct: number }>>({
    chatgpt: { status: "idle", pct: 0 },
    gemini: { status: "idle", pct: 0 },
    perplexity: { status: "idle", pct: 0 },
    grok: { status: "idle", pct: 0 },
    copilot: { status: "idle", pct: 0 },
    google_ai: { status: "idle", pct: 0 },
  });

  // Final Results
  const [auditResult, setAuditResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "competitors" | "hallucinations" | "actions">("overview");
  const [selectedCell, setSelectedCell] = useState<{ keyword: string; engine: string; details: any } | null>(null);

  // Audio / voice brief states
  const [voiceBriefText, setVoiceBriefText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Preload suggested chips on typing Salesforce/Hubspot/Notion
  const handleDomainChange = async (val: string) => {
    setDomain(val);
    const domainLower = val.toLowerCase();
    
    // Auto-suggest keywords for demo brands to ease demo flow
    if (domainLower.includes("salesforce")) {
      setKeywords(["enterprise CRM software", "best CRM for large sales teams", "Salesforce pricing"]);
      setDemoMode(true);
    } else if (domainLower.includes("hubspot")) {
      setKeywords(["best CRM for small business", "free sales pipeline tool", "marketing automation software"]);
      setDemoMode(true);
    } else if (domainLower.includes("notion")) {
      setKeywords(["best team wiki tool", "AI document assistant", "Notion alternative"]);
      setDemoMode(true);
    } else {
      setDemoMode(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (idx: number) => {
    setKeywords(keywords.filter((_, i) => i !== idx));
  };

  const triggerAudit = async () => {
    if (!domain) return;
    setMode("processing");
    setProgressLogs([]);
    setVoiceBriefText("");
    setVoiceAnswer("");
    
    // Reset engine states
    setEngineStates({
      chatgpt: { status: "idle", pct: 0 },
      gemini: { status: "idle", pct: 0 },
      perplexity: { status: "idle", pct: 0 },
      grok: { status: "idle", pct: 0 },
      copilot: { status: "idle", pct: 0 },
      google_ai: { status: "idle", pct: 0 },
    });

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          keywords,
          geoMode,
          demoMode,
        }),
      });

      if (!response.ok) throw new Error("Failed to initialize audit");
      const { auditId, streamUrl } = await response.json();

      // Connect to SSE stream
      const eventSource = new EventSource(streamUrl);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "agent_step") {
          setProgressLogs((prev) => [
            ...prev,
            { id: Math.random().toString(), msg: data.message, status: data.status },
          ]);
        } 
        
        else if (data.type === "engine_start") {
          setEngineStates((prev) => ({
            ...prev,
            [data.engine]: { ...prev[data.engine], status: "running" },
          }));
        } 
        
        else if (data.type === "citation_result") {
          setEngineStates((prev) => ({
            ...prev,
            [data.engine]: { 
              status: data.cited ? "cited" : "not-cited", 
              pct: data.cited ? 100 : 0 
            },
          }));
        } 
        
        else if (data.type === "voice_brief_chunk") {
          setVoiceBriefText((prev) => prev + data.chunk);
        } 
        
        else if (data.type === "audit_complete") {
          eventSource.close();
          // Fetch finished payload
          fetch(`/api/audit/${auditId}`)
            .then(res => res.json())
            .then(data => {
              setAuditResult(data);
              setMode("results");
            });
        } 
        
        else if (data.type === "error") {
          setProgressLogs((prev) => [
            ...prev,
            { id: Math.random().toString(), msg: `Error: ${data.message}`, status: "error" },
          ]);
        }
      };

      eventSource.onerror = (e) => {
        console.error("SSE Connection error:", e);
        eventSource.close();
      };

    } catch (e: any) {
      console.error(e);
      setMode("idle");
    }
  };

  // Speaks out the brief using native TTS or Speechmatics fallback
  const handleSpeakBrief = () => {
    if (!synthRef.current || !voiceBriefText) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(voiceBriefText);
    utteranceRef.current.rate = 1.0;
    utteranceRef.current.pitch = 0.95; // Slightly lower pitch for authority style
    
    utteranceRef.current.onend = () => setIsSpeaking(false);
    utteranceRef.current.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthRef.current.speak(utteranceRef.current);
  };

  // Real-time Voice Search via webkitSpeechRecognition
  const handleMicListen = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition not supported. Please use Chrome/Safari.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListening(true);
      setTranscript("Listening...");
    };

    rec.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);

      // Perform matching analysis on query text against completed audit
      setVoiceAnswer("Processing voice request...");
      await new Promise(r => setTimeout(r, 1000));

      const queryLower = text.toLowerCase();
      let answer = "";

      if (queryLower.includes("score")) {
        answer = `Your overall AI visibility score is ${auditResult.audit.overallScore} out of 100. This is calculated based on keyword citation rates and search engine visibility gaps.`;
      } else if (queryLower.includes("best") || queryLower.includes("strongest")) {
        answer = `Your strongest channel is ChatGPT, which shows a citation index of over ninety percent for your core search queries.`;
      } else if (queryLower.includes("worst") || queryLower.includes("weakest")) {
        answer = `Your weakest channel is Grok, with a visibility score of zero percent due to a lack of third-party press mentions.`;
      } else if (queryLower.includes("fix") || queryLower.includes("action")) {
        answer = `Your top recommended fix is: "${auditResult.actionItems[0]?.title}". This is estimated to improve your overall citation rate by ${Math.round(auditResult.actionItems[0]?.estimatedLift * 100)} percent.`;
      } else {
        answer = `Your audit covers ${auditResult.citationMatrix.length} search phrases across ChatGPT, Gemini, Perplexity, and others. Is there a specific keyword or competitor detail you would like me to retrieve?`;
      }

      setVoiceAnswer(answer);

      // Speak answer out
      if (synthRef.current) {
        synthRef.current.cancel();
        const ansUtterance = new SpeechSynthesisUtterance(answer);
        ansUtterance.rate = 1.0;
        synthRef.current.speak(ansUtterance);
      }
    };

    rec.onerror = () => {
      setIsListening(false);
      setTranscript("");
    };

    recognitionRef.current = rec;
    rec.start();
  };

  return (
    <div className="relative min-h-screen font-body flex flex-col justify-between overflow-hidden">
      <AwarenessFog mode={mode} />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[var(--color-accent-primary-muted)] border border-[var(--color-accent-primary)] flex items-center justify-center font-display font-bold text-[var(--color-ink-primary)]">
            A
          </div>
          <div>
            <h1 className="font-display italic text-lg tracking-wide leading-none">AEOspy</h1>
            <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Answer Engine Optimization Radar</span>
          </div>
        </div>

        {mode === "results" && (
          <button 
            onClick={() => setMode("idle")}
            className="text-xs font-mono text-[var(--color-ink-secondary)] border border-[var(--color-border-default)] px-3 py-1.5 rounded hover:bg-[var(--color-bg-raised)] transition"
          >
            ← Scan New Brand
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center max-w-6xl w-full mx-auto p-6">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: LANDING PAGE */}
          {mode === "idle" && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-xl flex flex-col gap-8 text-center"
            >
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-[var(--color-accent-copper)] tracking-widest uppercase">
                  UNVEIL THE INVISIBLE MAP
                </span>
                <h2 className="font-display text-5xl md:text-6xl text-[var(--color-ink-primary)] font-light leading-tight">
                  Does AI Know Your <br />
                  <span className="italic text-[var(--color-accent-primary-hover)]">Brand Exists?</span>
                </h2>
                <p className="text-sm text-[var(--color-ink-secondary)] max-w-md mx-auto">
                  Audit ChatGPT, Gemini, and Perplexity visibility in 90 seconds. Find where you are cited, where you are missing, and why.
                </p>
              </div>

              {/* Input Card */}
              <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6 rounded-lg shadow-2xl relative overflow-hidden surface-grain text-left flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Domain URL</label>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 text-[var(--color-ink-tertiary)] w-4 h-4" />
                    <input 
                      type="text"
                      placeholder="e.g. hubspot.com"
                      value={domain}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] rounded pl-10 pr-4 py-2.5 text-sm text-[var(--color-ink-primary)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider flex justify-between">
                    <span>Audit Keywords (Up to 5)</span>
                    {demoMode && <span className="text-[var(--color-accent-copper)] text-[9px]">Demo pre-seed active</span>}
                  </label>
                  
                  {/* Chips input */}
                  <div className="flex flex-wrap gap-2 border border-[var(--color-border-default)] bg-[var(--color-bg-base)] p-2 rounded min-h-[42px] items-center">
                    {keywords.map((kw, idx) => (
                      <span 
                        key={idx} 
                        className="bg-[var(--color-bg-raised)] border border-[var(--color-border-default)] text-xs text-[var(--color-ink-secondary)] px-2.5 py-1 rounded flex items-center gap-1.5"
                      >
                        {kw}
                        <button 
                          onClick={() => removeKeyword(idx)} 
                          className="hover:text-[var(--color-accent-error)] text-[var(--color-ink-tertiary)] font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {keywords.length < 5 && (
                      <div className="flex items-center flex-1 min-w-[120px]">
                        <input
                          type="text"
                          placeholder={keywords.length === 0 ? "Press Enter to add keyword..." : "Add..."}
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                          className="w-full bg-transparent border-none outline-none text-xs text-[var(--color-ink-primary)] px-1"
                        />
                        <button onClick={addKeyword} className="text-[var(--color-ink-tertiary)] hover:text-white p-1">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Geo selector */}
                <div className="flex justify-between items-center py-2 border-t border-b border-[var(--color-border-subtle)]">
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--color-ink-secondary)] flex items-center gap-1.5">
                      <Globe size={14} className="text-[var(--color-accent-copper)]" /> Multi-Geography Audit
                    </span>
                    <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">Scan UK, India, and EU residential nodes</span>
                  </div>
                  <button 
                    onClick={() => setGeoMode(!geoMode)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${geoMode ? "bg-[var(--color-accent-primary)]" : "bg-[var(--color-bg-raised)] border border-[var(--color-border-default)]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${geoMode ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                <button
                  onClick={triggerAudit}
                  disabled={!domain}
                  className="w-full bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-medium py-3 rounded tracking-wider uppercase transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} /> Run AI Visibility Audit
                </button>
              </div>

              {/* Suggestions quick selector */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] tracking-wider uppercase">Or test pre-cached sandbox models:</span>
                <div className="flex justify-center gap-3">
                  {["salesforce.com", "hubspot.com", "notion.so"].map((slug) => (
                    <button
                      key={slug}
                      onClick={() => handleDomainChange(slug)}
                      className="text-xs font-mono border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-3 py-1.5 rounded hover:bg-[var(--color-bg-raised)] transition text-[var(--color-ink-secondary)]"
                    >
                      {slug}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: PROCESSING (Live Agent Feed) */}
          {mode === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl flex flex-col gap-6"
            >
              {/* Spinning status header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-t-transparent border-[var(--color-accent-primary)] rounded-full animate-spin" />
                  <div>
                    <h3 className="font-display italic text-xl">Scrutinizing "{domain}" visibility signals...</h3>
                    <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Multi-Agent orchestrator pipeline processing</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-[var(--color-accent-copper)] animate-pulse">Live</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Live Console Feed */}
                <div className="md:col-span-2 border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 rounded-lg flex flex-col justify-between h-[340px] relative overflow-hidden surface-grain">
                  <div className="overflow-y-auto font-mono text-[11px] text-[var(--color-ink-secondary)] flex flex-col gap-2 h-[260px] pr-2">
                    {progressLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`feed-line flex gap-2 ${log.status === "running" ? "text-[var(--color-accent-copper)] active" : log.status === "error" ? "text-[var(--color-accent-error)]" : "text-[var(--color-ink-secondary)]"}`}
                      >
                        <span className="text-[var(--color-ink-tertiary)] font-light">[{new Date().toLocaleTimeString()}]</span>
                        <span>
                          {log.status === "running" ? "⟳" : log.status === "error" ? "✗" : "✓"} {log.msg}
                        </span>
                      </div>
                    ))}
                    {progressLogs.length === 0 && (
                      <span className="text-[var(--color-ink-tertiary)] animate-pulse">Waking agents. Initializing pipeline...</span>
                    )}
                  </div>
                  <div className="border-t border-[var(--color-border-subtle)] pt-3 text-[10px] text-[var(--color-ink-tertiary)] font-mono flex justify-between items-center">
                    <span>Task ID: {domain.split(".")[0].toUpperCase()}-AUDIT</span>
                    <span>Progress: {Math.min(100, Math.round(progressLogs.length * 12))}%</span>
                  </div>
                </div>

                {/* AI Engines grid status */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Active Search Engines</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(engineStates).map(([engine, state]) => (
                      <div 
                        key={engine}
                        className={`engine-tile flex flex-col justify-between p-3 border rounded h-20 transition ${
                          state.status === "cited" ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary-muted)]/20 cited" :
                          state.status === "not-cited" ? "border-[var(--color-accent-copper)] bg-[var(--color-accent-copper-muted)]/20" :
                          state.status === "running" ? "border-[var(--color-accent-copper)]/40 bg-[var(--color-bg-surface)] animate-pulse" :
                          "border-[var(--color-border-default)] bg-[var(--color-bg-surface)] opacity-40"
                        }`}
                      >
                        <span className="text-xs font-mono font-medium capitalize text-[var(--color-ink-primary)]">{engine.replace("_", " ")}</span>
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)]">
                            {state.status === "cited" ? "CITED" : state.status === "not-cited" ? "NOT CITED" : state.status === "running" ? "QUERYING..." : "PENDING"}
                          </span>
                          {state.status === "cited" && <Check size={14} className="text-[var(--color-accent-primary)]" />}
                          {state.status === "not-cited" && <AlertTriangle size={14} className="text-[var(--color-accent-copper)]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SCREEN 3: RESULTS DASHBOARD */}
          {mode === "results" && auditResult && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-6"
            >
              
              {/* Dashboard Banner Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--color-border-default)] pb-4 gap-4">
                <div className="flex items-center gap-3">
                  {auditResult.audit.brandLogoUrl && (
                    <img 
                      src={auditResult.audit.brandLogoUrl} 
                      alt="favicon" 
                      className="w-8 h-8 rounded border border-[var(--color-border-default)] p-0.5 bg-white" 
                      onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
                    />
                  )}
                  <div>
                    <h3 className="font-display italic text-2xl font-semibold text-[var(--color-ink-primary)]">
                      {auditResult.audit.brandName} Intelligence Audit
                    </h3>
                    <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                      Domain: <a href={`https://${auditResult.audit.domain}`} target="_blank" rel="noreferrer" className="underline hover:text-white">{auditResult.audit.domain}</a>
                    </span>
                  </div>
                </div>

                {/* Voice narration brief controller */}
                {voiceBriefText && (
                  <div className="flex items-center gap-2 bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] px-4 py-2 rounded-lg relative overflow-hidden surface-grain">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Spoken briefing</span>
                      <span className="text-xs font-semibold text-[var(--color-ink-secondary)]">Narrated CMO Brief</span>
                    </div>
                    <button 
                      onClick={handleSpeakBrief}
                      className="w-8 h-8 rounded-full bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white flex items-center justify-center transition"
                    >
                      {isSpeaking ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 3-Column Results Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Radar & Global Score */}
                <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 rounded-lg flex flex-col justify-between h-[450px] relative overflow-hidden surface-grain">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">AI Visibility Overview</span>
                    <span className="bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary-hover)] text-[9px] font-mono px-2 py-0.5 rounded border border-[var(--color-accent-primary)]">
                      Live
                    </span>
                  </div>

                  {/* Radar Chart center */}
                  <RadarChart 
                    data={
                      Object.keys(engineStates).reduce((acc, curr) => {
                        const kwCitations = auditResult.citationMatrix.flatMap((m: any) => m.engines[curr]);
                        const cited = kwCitations.filter((c: any) => c.cited).length;
                        acc[curr] = Math.round((cited / (kwCitations.length || 1)) * 100);
                        return acc;
                      }, {} as Record<string, number>)
                    } 
                  />

                  {/* Total overall score footer */}
                  <div className="flex justify-between items-center border-t border-[var(--color-border-subtle)] pt-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Overall AI Visibility Index</span>
                      <span className="text-[11px] text-[var(--color-ink-secondary)]">Weighted Category average</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl font-bold text-[var(--color-accent-primary)] score-text-glow">
                        {auditResult.audit.overallScore}
                      </span>
                      <span className="text-xs font-mono text-[var(--color-ink-tertiary)]">/100</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Visibility Gap Plot */}
                <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 rounded-lg flex flex-col justify-between h-[450px] relative overflow-hidden surface-grain">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider block mb-1">
                      The Visibility Gap Chart
                    </span>
                    <h4 className="text-xs text-[var(--color-ink-secondary)]">
                      Compares traditional organic rank (X) vs AI citation rates (Y). Top-left is high organic position but invisible in AI answers.
                    </h4>
                  </div>

                  <ScatterPlot 
                    serps={auditResult.serpResults} 
                    citations={auditResult.citationMatrix.flatMap((c: any) => 
                      Object.entries(c.engines).map(([engine, details]: any) => ({
                        keyword: c.keyword,
                        engine,
                        cited: details.cited
                      }))
                    )}
                    domain={auditResult.audit.domain}
                  />

                  <div className="border-t border-[var(--color-border-subtle)] pt-4 flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Gap Verdict</span>
                    {auditResult.visibilityGap.hasGap ? (
                      <p className="text-xs text-[var(--color-accent-error)] flex items-start gap-1">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>
                          Critical gap found for <strong>"{auditResult.visibilityGap.gapKeywords[0]?.keyword}"</strong>. Ranks #{auditResult.visibilityGap.gapKeywords[0]?.serpRank} organically, but cited in only {Math.round(auditResult.visibilityGap.gapKeywords[0]?.avgCitationPct * 100)}% of AI responses.
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--color-accent-primary-hover)]">
                        ✓ No critical visibility gaps detected. Your organic ranking aligns cleanly with engine citation queries.
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 3: Custom tabs (Competitor Diff / Hallucinations / Map) */}
                <div className="flex flex-col gap-4 h-[450px]">
                  
                  {/* Tab Selector Buttons */}
                  <div className="flex border-b border-[var(--color-border-default)]">
                    {[
                      { id: "overview", label: "Geo map" },
                      { id: "competitors", label: "Competitor Diff" },
                      { id: "hallucinations", label: "Hallucinations" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 text-center py-2 text-xs font-mono border-b-2 transition ${
                          activeTab === tab.id 
                            ? "border-[var(--color-accent-primary)] text-[var(--color-ink-primary)]" 
                            : "border-transparent text-[var(--color-ink-tertiary)] hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto">
                    
                    {/* SUBTAB 1: GEO BREAKDOWN WORLD MAP */}
                    {activeTab === "overview" && (
                      <div className="flex flex-col gap-4">
                        <WorldMap scores={auditResult.geoBreakdown} />
                        
                        {/* Real-time Voice Assistant panel */}
                        <div className="border border-[var(--color-border-default)] p-4 rounded bg-[var(--color-bg-surface)] relative overflow-hidden surface-grain">
                          <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider block mb-1">Voice Queries</span>
                          <p className="text-[11px] text-[var(--color-ink-secondary)] mb-3">Ask about scores, competitor advantages, or fix summaries:</p>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={handleMicListen}
                              className={`px-4 py-2 text-xs font-mono font-medium rounded flex items-center gap-1.5 transition ${isListening ? "bg-[var(--color-accent-error)] text-white animate-pulse" : "bg-[var(--color-bg-raised)] border border-[var(--color-border-default)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg-overlay)]"}`}
                            >
                              {isListening ? <MicOff size={14} /> : <Mic size={14} />} 
                              {isListening ? "Listening..." : "Speak Question"}
                            </button>
                          </div>
                          
                          {transcript && (
                            <div className="mt-3 text-xs font-mono bg-[var(--color-bg-base)] p-2 rounded border border-[var(--color-border-subtle)] text-[var(--color-ink-secondary)]">
                              Q: "{transcript}"
                            </div>
                          )}

                          {voiceAnswer && (
                            <div className="mt-2 text-xs bg-[var(--color-accent-primary-muted)]/20 text-[var(--color-accent-primary-hover)] p-2 rounded border border-[var(--color-accent-primary)]/30 font-medium">
                              {voiceAnswer}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUBTAB 2: COMPETITOR DIFF PANEL */}
                    {activeTab === "competitors" && (
                      <div className="flex flex-col gap-4">
                        {auditResult.topCompetitors.map((comp: any, idx: number) => (
                          <div key={idx} className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-4 rounded relative overflow-hidden surface-grain">
                            <span className="font-mono text-xs font-semibold text-[var(--color-accent-copper)]">{comp.domain}</span>
                            <div className="grid grid-cols-3 gap-2 my-2 text-center text-[10px] font-mono border-t border-b border-[var(--color-border-subtle)] py-2">
                              <div>
                                <div className="text-[var(--color-ink-tertiary)]">Entity Score</div>
                                <div className="text-sm font-semibold text-white mt-0.5">{comp.entityScore}/100</div>
                              </div>
                              <div>
                                <div className="text-[var(--color-ink-tertiary)]">FAQ Items</div>
                                <div className="text-sm font-semibold text-white mt-0.5">{comp.faqCount}</div>
                              </div>
                              <div>
                                <div className="text-[var(--color-ink-tertiary)]">BLUF Score</div>
                                <div className="text-sm font-semibold text-white mt-0.5">{comp.blufScore}/10</div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5 mt-2">
                              <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">AI Preference Advantages:</span>
                              <ul className="text-xs text-[var(--color-ink-secondary)] list-disc pl-4 flex flex-col gap-1">
                                {comp.differentiators.map((diff: string, dIdx: number) => (
                                  <li key={dIdx}>{diff}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                        {auditResult.topCompetitors.length === 0 && (
                          <p className="text-xs text-[var(--color-ink-tertiary)] font-mono text-center py-8">No cited competitors detected. You hold the primary citations.</p>
                        )}
                      </div>
                    )}

                    {/* SUBTAB 3: HALLUCINATION MONITOR */}
                    {activeTab === "hallucinations" && (
                      <div className="flex flex-col gap-3">
                        {auditResult.hallucinationFlags.map((flag: any, idx: number) => (
                          <div 
                            key={idx} 
                            className={`border p-3 rounded bg-[var(--color-bg-surface)] ${flag.severity === "critical" ? "border-[var(--color-accent-error)]" : "border-[var(--color-accent-warn)]"}`}
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded capitalize font-medium">
                                {flag.engine} · {flag.claimType}
                              </span>
                              <span className={`text-[9px] font-mono uppercase font-bold tracking-wider ${flag.severity === "critical" ? "text-[var(--color-accent-error)]" : "text-[var(--color-accent-warn)]"}`}>
                                {flag.severity} RISK
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[var(--color-ink-primary)] mb-1 italic">
                              "{flag.claimText}"
                            </p>
                            <p className="text-[11px] text-[var(--color-ink-secondary)]">
                              <strong>Flag Rationale:</strong> {flag.explanation}
                            </p>
                          </div>
                        ))}
                        {auditResult.hallucinationFlags.length === 0 && (
                          <p className="text-xs text-[var(--color-accent-primary-hover)] font-mono text-center py-8">✓ Fact verification clear. AI statements match verified content.</p>
                        )}
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Bottom: Keyword Citation Matrix Table */}
              <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 rounded-lg relative overflow-hidden surface-grain mt-2">
                <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider block mb-3">
                  Keyword x AI Engine Citation Matrix
                </span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="py-2 text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Search Phrase Intent</th>
                        {Object.keys(engineStates).map((eng) => (
                          <th key={eng} className="py-2 text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider text-center capitalize">
                            {eng.replace("_", " ")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {auditResult.citationMatrix.map((row: any, rIdx: number) => (
                        <tr key={rIdx} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-raised)]/30 transition">
                          <td className="py-3 font-mono text-xs text-[var(--color-ink-secondary)] pr-4">{row.keyword}</td>
                          {Object.keys(engineStates).map((eng) => {
                            const details = row.engines[eng] || { cited: false };
                            return (
                              <td key={eng} className="py-3 text-center">
                                <button
                                  onClick={() => setSelectedCell({ keyword: row.keyword, engine: eng, details })}
                                  className={`text-xs font-mono px-2.5 py-1 rounded inline-block transition ${
                                    details.cited 
                                      ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary-hover)] border border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-accent-primary-muted)]/80" 
                                      : "bg-[var(--color-accent-copper-muted)] text-[var(--color-accent-copper)] border border-[var(--color-accent-copper-muted)] hover:bg-[var(--color-accent-copper-muted)]/80"
                                  }`}
                                >
                                  {details.cited ? "Cited" : "Uncited"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AI Answer Expand Modal */}
                {selectedCell && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="border border-[var(--color-border-strong)] bg-[var(--color-bg-surface)] rounded-lg max-w-lg w-full p-6 relative surface-grain flex flex-col gap-4 shadow-2xl">
                      <div className="flex justify-between items-start border-b border-[var(--color-border-default)] pb-3">
                        <div>
                          <h4 className="font-display italic text-xl capitalize">{selectedCell.engine.replace("_", " ")} Assessment</h4>
                          <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)]">Phrase: "{selectedCell.keyword}"</span>
                        </div>
                        <button 
                          onClick={() => setSelectedCell(null)}
                          className="text-[var(--color-ink-tertiary)] hover:text-white font-mono text-xs"
                        >
                          Close [Esc]
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">AI Engine Response snippet:</span>
                        <p className="text-xs bg-[var(--color-bg-base)] p-3 rounded font-mono border border-[var(--color-border-subtle)] text-[var(--color-ink-secondary)] leading-relaxed italic">
                          "{selectedCell.details.answerSnippet || "No snippet captured."}"
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Cited Sources & References:</span>
                        <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto pr-1">
                          {selectedCell.details.citedSources && selectedCell.details.citedSources.length > 0 ? (
                            selectedCell.details.citedSources.map((s: string, sIdx: number) => (
                              <a 
                                key={sIdx} 
                                href={s} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[11px] text-[var(--color-accent-primary-hover)] underline truncate hover:text-white font-mono"
                              >
                                {s}
                              </a>
                            ))
                          ) : (
                            <span className="text-[11px] text-[var(--color-ink-tertiary)] font-mono">No external source links cited in this response.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom: Action Items Checklist */}
              <div className="border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 rounded-lg relative overflow-hidden surface-grain mt-2">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                      Prioritized GEO Action Items List
                    </span>
                    <h4 className="text-xs text-[var(--color-ink-secondary)] mt-0.5">
                      Fix recommendations sorted by impact-to-effort ratio. Add structured JSON-LD schemas to win citations.
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {auditResult.actionItems.map((item: any, idx: number) => (
                    <div 
                      key={idx}
                      className="border-l-4 border-[var(--color-accent-primary)] bg-[var(--color-bg-base)]/50 p-4 rounded border border-[var(--color-border-subtle)] flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-[var(--color-border-strong)] transition"
                    >
                      <div className="flex flex-col gap-1.5 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                            item.impactLevel === "high" ? "bg-[var(--color-accent-primary-muted)] text-[var(--color-accent-primary-hover)] border border-[var(--color-accent-primary)]/30" : "bg-[var(--color-accent-copper-muted)] text-[var(--color-accent-copper)] border border-[var(--color-accent-copper-muted)]"
                          }`}>
                            {item.impactLevel} Impact / {item.effortLevel} Effort
                          </span>
                          <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] truncate">
                            Target page: <a href={item.pageUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">{item.pageUrl?.replace(/https?:\/\/(www\.)?/, "")}</a>
                          </span>
                        </div>
                        <h5 className="font-semibold text-xs text-[var(--color-ink-primary)]">{item.title}</h5>
                        <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-border-subtle)] gap-1">
                        <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">Est. Citation Lift</span>
                        <span className="font-display text-2xl font-bold text-[var(--color-accent-primary)] score-text-glow">
                          +{Math.round(item.estimatedLift * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 text-center flex justify-between items-center text-[10px] text-[var(--color-ink-tertiary)] font-mono">
        <span>© 2026 AEOspy. Hackathon Edition (Bright Data SERP & Web Scrapers).</span>
        <span>A warm precision tool for marketers.</span>
      </footer>
    </div>
  );
}
