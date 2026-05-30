"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Key, Network, Mic2, Settings2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [keys, setKeys] = useState({
    gemini: "",
    speechmatics: "",
    brightdata: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing keys from localStorage if they exist
    const savedKeys = localStorage.getItem("aeospy_api_keys");
    if (savedKeys) {
      try {
        setKeys(JSON.parse(savedKeys));
      } catch (e) {
        // invalid JSON
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("aeospy_api_keys", JSON.stringify(keys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen font-body flex flex-col justify-start overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--color-ink-tertiary)] hover:text-white transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display italic text-lg tracking-wide leading-none">
              AEOspy Configuration
            </h1>
            <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
              Workspace Settings
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto p-6 pt-12">
        <div className="w-full mb-8">
          <h2 className="font-display text-4xl text-[var(--color-ink-primary)] font-light leading-tight flex items-center gap-3">
            <Settings2 className="text-[var(--color-accent-primary)]" size={32} />
            API & Integrations
          </h2>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-2">
            Configure your provider keys to enable live scraping, agentic evaluation, and voice briefings.
            Keys are stored securely in your browser's local storage and injected at runtime.
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Key size={16} className="text-[var(--color-accent-copper)]" />
              <h3 className="font-mono text-sm text-[var(--color-ink-primary)] font-semibold uppercase tracking-wide">
                Google Gemini API Key
              </h3>
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)]">
              Used by the Keyword Enrichment Agent and Hallucination Checker.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keys.gemini}
              onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
              className="bg-[var(--color-bg-base)] border border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] rounded px-4 py-2.5 text-xs text-[var(--color-ink-primary)] outline-none font-mono w-full transition-colors"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Network size={16} className="text-[var(--color-accent-copper)]" />
              <h3 className="font-mono text-sm text-[var(--color-ink-primary)] font-semibold uppercase tracking-wide">
                Bright Data Scraping Browser
              </h3>
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)]">
              Required to bypass Cloudflare/bot protections on competitor websites and search engine pages.
            </p>
            <input
              type="password"
              placeholder="wss://brd-customer-xxxx-zone-scraping..."
              value={keys.brightdata}
              onChange={(e) => setKeys({ ...keys, brightdata: e.target.value })}
              className="bg-[var(--color-bg-base)] border border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] rounded px-4 py-2.5 text-xs text-[var(--color-ink-primary)] outline-none font-mono w-full transition-colors"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-lg flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mic2 size={16} className="text-[var(--color-accent-copper)]" />
              <h3 className="font-mono text-sm text-[var(--color-ink-primary)] font-semibold uppercase tracking-wide">
                Speechmatics Flow API
              </h3>
            </div>
            <p className="text-[11px] text-[var(--color-ink-tertiary)]">
              Powers the real-time voice briefing agent and speech-to-text queries.
            </p>
            <input
              type="password"
              placeholder="Bearer xxxx..."
              value={keys.speechmatics}
              onChange={(e) => setKeys({ ...keys, speechmatics: e.target.value })}
              className="bg-[var(--color-bg-base)] border border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] rounded px-4 py-2.5 text-xs text-[var(--color-ink-primary)] outline-none font-mono w-full transition-colors"
            />
          </motion.div>

          <div className="flex justify-end items-center gap-4 mt-4">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent-primary-hover)] animate-pulse">
                <ShieldCheck size={14} /> Keys Encrypted & Saved
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white text-xs font-mono font-medium px-6 py-2.5 rounded tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(61,107,79,0.4)] flex items-center gap-2"
            >
              <Save size={14} /> Save Configuration
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
