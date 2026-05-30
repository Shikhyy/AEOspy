"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Mic2,
  Network,
  Play,
  Pause,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  FileText,
  Volume2
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { EcosystemMarquee } from "@/components/Marquee";

// ─────────────────────────────────────────
// Background Grid Design
// ─────────────────────────────────────────
function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-25">
      <svg className="absolute inset-0 w-full h-full stroke-white/[0.02] [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse" x="-1" y="-1">
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────
// Live Audit Simulator Data
// ─────────────────────────────────────────
interface LogLine {
  text: string;
  type: "info" | "success" | "warning";
}

interface PresetData {
  name: string;
  score: number;
  gaps: number;
  competitors: string;
  engines: Array<{ name: string; status: string; detail: string }>;
  logs: LogLine[];
}

const PRESETS: Record<"notion.so" | "linear.app" | "hubspot.com", PresetData> = {
  "notion.so": {
    name: "Notion",
    score: 58,
    gaps: 5,
    competitors: "Confluence, Coda",
    engines: [
      { name: "ChatGPT", status: "Cited", detail: "Citing Notion for document management, but missing on team wiki queries." },
      { name: "Gemini", status: "Missing", detail: "Recommending Confluence and Google Docs. Notion entity not recognized in final context." },
      { name: "Perplexity", status: "Cited", detail: "Citing Notion with correct links to blog posts." },
      { name: "Claude 3.5", status: "Cited", detail: "Recommending Notion for personal use, but Coda for enterprise database capabilities." },
      { name: "Copilot", status: "Missing", detail: "Recommending MS Loop exclusively for team collaboration." },
      { name: "Google AI", status: "Cited", detail: "Citing Notion in search generative summaries." }
    ],
    logs: [
      { text: "[System] Starting audit pipeline for notion.so...", type: "info" },
      { text: "[Bright Data] Scraped homepage: extracted entities [Notion, wiki, notes, project management].", type: "success" },
      { text: "[Bright Data SERP] Organic SERP analysis: notion.so ranks for 2,400 high-intent keywords.", type: "info" },
      { text: "[AEO Agent] Querying ChatGPT Plus via Scraping Browser... CITED but missing on comparison queries.", type: "warning" },
      { text: "[AEO Agent] Querying Gemini Advanced... MISSING. Slack/Confluence cited instead.", type: "warning" },
      { text: "[AEO Agent] Querying Perplexity Pro... CITED. Verified citation links found.", type: "success" },
      { text: "[AEO Agent] Running hallucination check... 0 false claims detected.", type: "success" },
      { text: "[Speechmatics] Synthesizing CMO Voice Briefing audio stream...", type: "info" },
      { text: "[System] Audit completed. Score compiled: 58%.", type: "success" }
    ]
  },
  "linear.app": {
    name: "Linear",
    score: 84,
    gaps: 2,
    competitors: "Jira, Asana",
    engines: [
      { name: "ChatGPT", status: "Cited", detail: "Citing Linear as the premier issue tracker for engineering teams." },
      { name: "Gemini", status: "Cited", detail: "Recommending Linear for software development due to speed." },
      { name: "Perplexity", status: "Cited", detail: "Citing Linear with rich formatting and linking to documentation." },
      { name: "Claude 3.5", status: "Cited", detail: "Highly recommending Linear for startup project management." },
      { name: "Copilot", status: "Missing", detail: "Recommending Azure DevOps and Jira for development teams." },
      { name: "Google AI", status: "Cited", detail: "Citing Linear for issue tracking." }
    ],
    logs: [
      { text: "[System] Starting audit pipeline for linear.app...", type: "info" },
      { text: "[Bright Data] Scraped homepage: extracted entities [Linear, issues, projects, sprint planning].", type: "success" },
      { text: "[Bright Data SERP] Organic SERP analysis: linear.app ranks #1 for 'fast issue tracker'.", type: "info" },
      { text: "[AEO Agent] Querying ChatGPT Plus via Scraping Browser... CITED.", type: "success" },
      { text: "[AEO Agent] Querying Gemini Advanced... CITED.", type: "success" },
      { text: "[AEO Agent] Querying Perplexity Pro... CITED with full references.", type: "success" },
      { text: "[AEO Agent] Querying Microsoft Copilot... MISSING. Azure boards recommended.", type: "warning" },
      { text: "[AEO Agent] Running hallucination check... 0 false claims detected.", type: "success" },
      { text: "[Speechmatics] Synthesizing CMO Voice Briefing audio stream...", type: "info" },
      { text: "[System] Audit completed. Score compiled: 84%.", type: "success" }
    ]
  },
  "hubspot.com": {
    name: "HubSpot",
    score: 46,
    gaps: 7,
    competitors: "Salesforce CRM, Pipedrive",
    engines: [
      { name: "ChatGPT", status: "Cited", detail: "Citing HubSpot for marketing automation, but missing on sales CRM lists." },
      { name: "Gemini", status: "Missing", detail: "Citing Salesforce and Zoho CRM for mid-market requirements." },
      { name: "Perplexity", status: "Cited", detail: "Citing HubSpot free tools but recommending competitors for advanced analytics." },
      { name: "Claude 3.5", status: "Missing", detail: "Citing Salesforce CRM as the industry standard. HubSpot not recommended for enterprise." },
      { name: "Copilot", status: "Cited", detail: "Citing HubSpot for marketing automation features." },
      { name: "Google AI", status: "Missing", detail: "Recommending Salesforce." }
    ],
    logs: [
      { text: "[System] Starting audit pipeline for hubspot.com...", type: "info" },
      { text: "[Bright Data] Scraped homepage: extracted entities [HubSpot, CRM, inbound marketing, sales platform].", type: "success" },
      { text: "[Bright Data SERP] Organic SERP analysis: hubspot.com ranks #1 for 'best CRM software'.", type: "info" },
      { text: "[AEO Agent] Querying ChatGPT Plus via Scraping Browser... CITED only for marketing features.", type: "warning" },
      { text: "[AEO Agent] Querying Gemini Advanced... MISSING. Salesforce cited.", type: "warning" },
      { text: "[AEO Agent] Querying Claude 3.5... MISSING on enterprise CRM lists.", type: "warning" },
      { text: "[AEO Agent] Querying Microsoft Copilot... CITED for marketing software.", type: "success" },
      { text: "[AEO Agent] Running hallucination check... 1 warning: Claude hallucinates pricing limits.", type: "warning" },
      { text: "[Speechmatics] Synthesizing CMO Voice Briefing audio stream...", type: "info" },
      { text: "[System] Audit completed. Score compiled: 46%.", type: "success" }
    ]
  }
};

// ─────────────────────────────────────────
// Interactive Audit Simulator Component
// ─────────────────────────────────────────
function InteractiveAuditSimulator() {
  const [selectedDomain, setSelectedDomain] = useState<"notion.so" | "linear.app" | "hubspot.com">("notion.so");
  const [stage, setStage] = useState<"running" | "completed">("running");
  const [visibleLogs, setVisibleLogs] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"summary" | "engines">("summary");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const data = PRESETS[selectedDomain];

  useEffect(() => {
    setStage("running");
    setVisibleLogs([]);
    setProgress(0);
    setIsAudioPlaying(false);

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < data.logs.length) {
        setVisibleLogs((prev) => [...prev, data.logs[currentLogIndex]]);
        currentLogIndex++;
        setProgress(Math.min(95, Math.floor((currentLogIndex / data.logs.length) * 100)));
      } else {
        clearInterval(interval);
        setProgress(100);
        setStage("completed");
      }
    }, 400);

    return () => clearInterval(interval);
  }, [selectedDomain, data]);

  return (
    <div className="w-full max-w-4xl bg-[#161410] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_32px_96px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-auto md:h-[420px] text-left z-15 relative">
      {/* Left Sidebar: Brand selector + Terminal log */}
      <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col bg-neutral-950/30">
        {/* Preset Selector */}
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/20">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Select Brand Demo</span>
          <div className="flex gap-1.5">
            {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition duration-200 ${
                  selectedDomain === dom 
                    ? "bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary-hover)] border border-[var(--color-accent-primary)]/40 font-medium" 
                    : "bg-neutral-900/50 text-neutral-400 border border-neutral-800 hover:text-white"
                }`}
              >
                {PRESETS[dom].name}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto flex flex-col justify-between bg-neutral-950/80 min-h-[200px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 mb-1 text-neutral-500 text-[10px]">
              <Terminal size={12} className="text-[var(--color-accent-primary)]" />
              <span>AEOspy Multi-Agent Pipeline</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {visibleLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={`transition-opacity duration-200 leading-relaxed ${
                    log.type === "success" 
                      ? "text-emerald-400" 
                      : log.type === "warning" 
                        ? "text-amber-400" 
                        : "text-neutral-400"
                  }`}
                >
                  <span className="text-neutral-600 mr-2">$</span>
                  {log.text}
                </div>
              ))}
              {stage === "running" && (
                <div className="text-[var(--color-accent-primary)] flex items-center gap-1.5 mt-1 animate-pulse">
                  <span>▊</span> Running audit...
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center gap-3">
            <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--color-accent-primary)]" 
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-400 w-8 text-right shrink-0">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Dynamic Results Dashboard */}
      <div className="w-full md:w-7/12 flex flex-col p-6 bg-gradient-to-br from-neutral-900/10 to-neutral-950/10 justify-between min-h-[240px] md:min-h-0">
        <AnimatePresence mode="wait">
          {stage === "running" ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8"
            >
              <div className="relative w-16 h-16 rounded-full border border-neutral-850 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-t border-[var(--color-accent-primary)]"
                />
                <Globe className="text-neutral-500 animate-pulse" size={20} />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Querying Answer Engines</h4>
                <p className="text-[11px] text-neutral-500 mt-1 max-w-[280px] leading-relaxed mx-auto">
                  Crawling citation contexts and verifying brand entity maps...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col h-full justify-between"
            >
              {/* Report Header */}
              <div className="flex justify-between items-start border-b border-neutral-800/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{data.name}</h3>
                    <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono px-1.5 py-0.5 rounded">
                      {selectedDomain}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Generative Search Intelligence Audit</p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-2xl font-display font-bold text-[var(--color-accent-primary-hover)] score-text-glow leading-none">
                    {data.score}%
                  </span>
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mt-1">AEO Visibility</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-800/20 text-[10px] font-mono mt-4 gap-4">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`pb-1.5 border-b-2 transition duration-200 ${
                    activeTab === "summary" 
                      ? "border-[var(--color-accent-primary)] text-[var(--color-accent-primary-hover)] font-medium" 
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Identified Gaps
                </button>
                <button
                  onClick={() => setActiveTab("engines")}
                  className={`pb-1.5 border-b-2 transition duration-200 ${
                    activeTab === "engines" 
                      ? "border-[var(--color-accent-primary)] text-[var(--color-accent-primary-hover)] font-medium" 
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Engine Citation Details
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 py-4 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
                {activeTab === "summary" ? (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-3">
                        <span className="text-[8px] font-mono text-neutral-500 block uppercase tracking-wider">AEO Gap</span>
                        <span className="text-sm font-semibold text-white mt-0.5 block">{data.gaps} Queries Ignored</span>
                      </div>
                      <div className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-3">
                        <span className="text-[8px] font-mono text-neutral-500 block uppercase tracking-wider">Competitor Lead</span>
                        <span className="text-sm font-semibold text-white mt-0.5 block">{data.competitors.split(",")[0]}</span>
                      </div>
                    </div>

                    <div className="bg-[var(--color-accent-copper-glow)] border border-[var(--color-accent-copper)]/10 rounded-xl p-3 flex gap-2.5 items-start">
                      <AlertTriangle className="text-[var(--color-accent-copper)] shrink-0 mt-0.5" size={14} />
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent-copper)]">Optimization Hint</h5>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                          Your competitors are cited in comparison search queries due to schema structure. Inject structured comparison templates.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {data.engines.map((eng) => (
                      <div 
                        key={eng.name}
                        className="bg-neutral-900/20 border border-neutral-850 rounded-lg p-2 flex items-center justify-between group transition hover:border-neutral-800"
                        title={eng.detail}
                      >
                        <div className="flex items-center gap-2">
                          {eng.status === "Cited" ? (
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          ) : (
                            <XCircle size={12} className="text-neutral-500" />
                          )}
                          <span className="font-medium text-white">{eng.name}</span>
                        </div>
                        <span 
                          className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            eng.status === "Cited" 
                              ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/20" 
                              : "bg-neutral-950 text-neutral-500 border border-neutral-900"
                          }`}
                        >
                          {eng.status === "Cited" ? "Cited" : "Missing"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom widget: Audio briefing mockup */}
              <div className="mt-4 pt-4 border-t border-neutral-800/40 flex items-center gap-3">
                <button 
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white shrink-0 transition"
                  aria-label={isAudioPlaying ? "Pause summary briefing" : "Play summary briefing"}
                >
                  {isAudioPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono text-neutral-500 block uppercase tracking-widest">Speechmatics Summary</span>
                  <span className="text-xs font-medium text-white truncate block">Executive Voice Briefing — {data.name}</span>
                </div>
                <div className="flex items-end gap-0.5 h-4 px-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isAudioPlaying ? [3, 14, 3] : 3
                      }}
                      transition={{
                        duration: 0.5 + i * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-0.5 bg-[var(--color-accent-primary)] rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Bento Grid Component
// ─────────────────────────────────────────
function BentoCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#161410] border border-[var(--color-border-default)] hover:border-[var(--color-accent-primary)]/30 rounded-2xl p-6 transition-all duration-350 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--color-accent-primary-glow)] group relative overflow-hidden flex flex-col justify-between ${className}`}>
      {children}
    </div>
  );
}

function BentoFeaturesGrid() {
  const REGIONS = [
    { code: "US-NY", name: "New York, USA", ping: "42ms", state: "active" },
    { code: "UK-LD", name: "London, UK", ping: "68ms", state: "active" },
    { code: "EU-FR", name: "Frankfurt, Germany", ping: "81ms", state: "active" },
    { code: "IN-BL", name: "Bangalore, India", ping: "104ms", state: "active" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 max-w-6xl mx-auto w-full">
      
      {/* Large Featured Card: Global Radar (Spans 2 cols, 2 rows) */}
      <BentoCard className="md:col-span-2 md:row-span-2 min-h-[420px]">
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-accent-primary-muted)] border border-[var(--color-accent-primary)]/20 mb-5">
              <Globe size={18} className="text-[var(--color-accent-primary-hover)]" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2 font-normal leading-tight">
              Global Search Radar
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Scan localized AI engine answers using residential proxies. Track citation indexes across US, UK, EU, and India instantly to check local biases.
            </p>
          </div>

          {/* Regional Table UI representation */}
          <div className="mt-6 border border-neutral-850 rounded-xl bg-neutral-950/40 p-4 font-mono text-[10px] overflow-hidden flex flex-col gap-2.5">
            <div className="flex text-neutral-500 border-b border-neutral-900 pb-1.5">
              <span className="w-12 block">Region</span>
              <span className="flex-1 block">Location Node</span>
              <span className="w-16 text-right block">Latency</span>
              <span className="w-14 text-right block">Status</span>
            </div>
            {REGIONS.map((reg) => (
              <div key={reg.code} className="flex items-center text-neutral-300">
                <span className="w-12 text-neutral-500">{reg.code}</span>
                <span className="flex-1 truncate font-medium text-white">{reg.name}</span>
                <span className="w-16 text-right text-[var(--color-accent-primary-hover)]">{reg.ping}</span>
                <span className="w-14 text-right flex items-center justify-end gap-1 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
              </div>
            ))}
          </div>
        </div>
      </BentoCard>

      {/* Feature 2: Visibility Gaps (Spans 2 cols) */}
      <BentoCard className="md:col-span-2">
        <div className="flex gap-5 items-start">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-accent-copper-glow)] border border-[var(--color-accent-copper)]/20 shrink-0">
            <BarChart3 size={18} className="text-[var(--color-accent-copper)]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-1.5">Visibility Gap Mapping</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Detect terms where your brand ranks #1 organically on Google, yet AI engines completely omit your name from their summarized recommendations.
            </p>
            {/* Visual Mini Comparison Table */}
            <div className="border border-neutral-850 bg-neutral-950/20 rounded-lg p-2.5 font-mono text-[9px] flex justify-between items-center">
              <div>
                <span className="text-neutral-500 block uppercase">Query: Best wiki software</span>
                <div className="flex gap-4 mt-1">
                  <span className="text-white">Google SEO: <strong className="text-emerald-400">Rank #1</strong></span>
                  <span className="text-white">ChatGPT: <strong className="text-rose-400">Not Cited</strong></span>
                </div>
              </div>
              <span className="text-[8px] bg-rose-950/20 border border-rose-900/30 text-rose-400 px-2 py-0.5 rounded shrink-0">Gap Detected</span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Feature 3: Voice CMO Briefing (Spans 1 col) */}
      <BentoCard>
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
            <Mic2 size={18} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Executive Audio Briefs</h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Synthesize studio-quality CMO briefings on-demand using Speechmatics Text-to-Speech engine integration.
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Feature 4: Hallucination Sentinel (Spans 1 col) */}
      <BentoCard>
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20">
            <ShieldCheck size={18} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Hallucination Monitor</h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Instantly monitor and alert when models generate false negative claims or fabricate facts about your product.
            </p>
          </div>
        </div>
      </BentoCard>

      {/* Feature 5: Integration layers (Spans 2 cols) */}
      <BentoCard className="md:col-span-2">
        <div className="flex gap-5 items-start">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-accent-primary-muted)] border border-[var(--color-accent-primary)]/20 shrink-0">
            <Server size={18} className="text-[var(--color-accent-primary-hover)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1">Powered by Bright Data</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Built directly on Bright Data infrastructure. Bypasses cloud protections to query models reliably using scraping browser APIs and SERP proxies.
            </p>
            <div className="flex gap-2">
              <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-neutral-400">Web Unlocker</span>
              <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-neutral-400">Scraping Browser</span>
              <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-neutral-400">SERP API</span>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

// ─────────────────────────────────────────
// Natural Timeline Pipeline
// ─────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Domain Scrape",
    desc: "AEOspy extracts metadata, assets, schema tags, and key positioning terms directly from your website's landing pages.",
    color: "#3D6B4F"
  },
  {
    step: "02",
    icon: Layers,
    title: "Multi-Agent Crawl",
    desc: "Our automated agents concurrently audit 6 leading answer engines using residential proxy nodes to capture actual search context.",
    color: "#B5714A"
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Reports & Alerts",
    desc: "Review your AEO score, download optimized schema templates, flag hallucinations, and generate speech briefs for alignment.",
    color: "#C49040"
  }
];

function PipelineSection() {
  return (
    <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto w-full border-t border-neutral-900/50 mt-16">
      <div className="text-center mb-16">
        <span className="text-[11px] font-mono text-[var(--color-accent-copper)] uppercase tracking-widest">
          Audit Process
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-light text-[var(--color-ink-primary)] mt-3">
          Three stages. <span className="italic text-gradient-primary">90 seconds.</span>
        </h2>
        <p className="text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto mt-4 font-light leading-relaxed">
          Here is how our multi-agent crawler analyzes your generative search footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connection line overlay on desktop */}
        <div className="absolute top-[48px] left-16 right-16 h-[1px] border-t border-dashed border-neutral-800 hidden md:block -z-10" />

        {PIPELINE_STEPS.map((item) => (
          <div key={item.step} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 bg-[#161410] border border-neutral-800/80 p-6 rounded-2xl relative group hover:border-neutral-700 transition duration-300">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border relative z-10"
              style={{ background: item.color + "15", borderColor: item.color + "33" }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            
            <div className="absolute top-4 right-6 font-mono text-[10px] font-bold text-neutral-700 select-none">
              {item.step}
            </div>

            <div>
              <h3 className="font-semibold text-base text-white mb-2">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [inputDomain, setInputDomain] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDomain) return;
    let domain = inputDomain.trim().toLowerCase();
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "");
    router.push(`/audit?domain=${domain}`);
  };

  return (
    <div className="relative min-h-screen font-body overflow-x-hidden bg-[var(--color-bg-base)]">
      <GridBackground />

      {/* ── Nav ────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex justify-between items-center glass-panel border-b border-[var(--color-border-subtle)] bg-[#0e0d0b]/80 backdrop-blur-md">
        <div className="flex items-center">
          <Logo size="md" />
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
            className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-medium px-4 py-2 rounded tracking-wider transition shadow-[0_0_15px_rgba(61,107,79,0.3)] flex items-center gap-1.5"
          >
            <Sparkles size={12} /> Launch Audit
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center z-10">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900 border border-neutral-800 hover:border-neutral-750 transition px-3.5 py-1.5 rounded-full flex items-center gap-2 mb-8 cursor-default"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
          <span className="text-[10px] font-mono text-[var(--color-accent-primary-hover)] tracking-wider uppercase font-semibold">
            Generative search intelligence radar
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-8xl font-light tracking-tight text-white leading-[0.95] max-w-4xl"
        >
          Your Brand is <span className="font-semibold italic text-gradient-primary">Invisible</span> <br className="hidden md:block" /> to Answer Engines.
        </motion.h1>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-[var(--color-ink-secondary)] max-w-xl font-light leading-relaxed mt-6"
        >
          ChatGPT, Perplexity, and Gemini don't read standard SEO articles. 
          Use multi-agent crawling to audit what AI algorithms say about your brand.
        </motion.p>

        {/* Search Scanner Input */}
        <motion.form 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearchSubmit} 
          className="w-full max-w-lg mt-8 flex flex-col sm:flex-row gap-2.5 p-1.5 bg-[#161410]/60 border border-neutral-800 rounded-2xl shadow-xl"
        >
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-neutral-950/40 border border-neutral-850/60 rounded-xl focus-within:border-[var(--color-accent-primary)] transition duration-200">
            <Search size={14} className="text-neutral-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Enter brand URL (e.g. acme.com)" 
              className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-bold tracking-wider px-5 py-3 rounded-xl uppercase transition shadow-[0_0_15px_rgba(61,107,79,0.3)] shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Scan Brand <ArrowRight size={12} />
          </button>
        </motion.form>

        {/* Live Simulator Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 w-full flex justify-center"
        >
          <InteractiveAuditSimulator />
        </motion.div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-1 text-[var(--color-ink-ghost)] mt-12 select-none">
          <ChevronDown size={16} className="animate-bounce" />
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Scroll to Explore</span>
        </div>
      </section>

      {/* ── Marquee Section ────────────────────── */}
      <EcosystemMarquee />

      {/* ── Features Bento Grid ────────────────── */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] font-mono text-[var(--color-accent-copper)] uppercase tracking-widest">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[var(--color-ink-primary)] mt-3">
            Engineered to bridge <span className="italic text-[var(--color-accent-primary-hover)]">the citation gap.</span>
          </h2>
        </div>

        <BentoFeaturesGrid />
      </section>

      {/* ── Flow Pipeline Stage ────────────────── */}
      <PipelineSection />

      {/* ── Call To Action ────────────────────── */}
      <section className="relative z-10 py-24 px-6 flex justify-center bg-gradient-to-t from-neutral-950/40 to-transparent">
        <div className="bg-[#161410] rounded-3xl p-10 md:p-14 max-w-3xl w-full text-center flex flex-col items-center gap-6 border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent" />
          
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 flex items-center justify-center text-[var(--color-accent-primary-hover)]">
            <Sparkles size={22} />
          </div>

          <h2 className="font-display text-4xl font-light text-white leading-tight">
            Ready to claim <span className="italic">your AI footprint?</span>
          </h2>
          
          <p className="text-xs md:text-sm text-neutral-400 max-w-md leading-relaxed font-light">
            Audit your brand across ChatGPT, Gemini, and Perplexity in 90 seconds. Find search terms where you are hidden from generative engines.
          </p>

          <form onSubmit={handleSearchSubmit} className="w-full max-w-md mt-2 flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Enter brand domain (e.g. acme.com)" 
              className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-bold tracking-wider px-6 py-3 rounded-xl uppercase transition shrink-0"
            >
              Start Free Audit
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="relative z-10 border-t border-neutral-900 bg-neutral-950/60 backdrop-blur px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-[var(--color-accent-primary)]" />
          <span>© 2026 AEOspy — Answer Engine Optimization Intelligence</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/history" className="hover:text-white transition">History</Link>
          <Link href="/settings" className="hover:text-white transition">Settings</Link>
          <Link href="/audit" className="hover:text-white transition">Audit Radar</Link>
        </div>
      </footer>
    </div>
  );
}
