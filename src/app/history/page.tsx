"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AuditHistory {
  id: string;
  domain: string;
  brandName: string | null;
  overallScore: number | null;
  status: string;
  createdAt: number;
}

export default function HistoryPage() {
  const [audits, setAudits] = useState<AuditHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setAudits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setLoading(false);
      });
  }, []);

  const filteredAudits = audits.filter(
    (a) =>
      a.domain.toLowerCase().includes(search.toLowerCase()) ||
      (a.brandName && a.brandName.toLowerCase().includes(search.toLowerCase()))
  );

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
              AEOspy History
            </h1>
            <span className="text-[9px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
              Past Audits
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto p-6 pt-12">
        <div className="w-full flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-4xl text-[var(--color-ink-primary)] font-light leading-tight">
              Audit Archive
            </h2>
            <p className="text-sm text-[var(--color-ink-secondary)]">
              Review historical answer engine optimization scans.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] rounded pl-10 pr-4 py-2 text-xs text-[var(--color-ink-primary)] outline-none font-mono w-64 glass-panel"
            />
          </div>
        </div>

        {/* History List */}
        <div className="w-full flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-[var(--color-ink-tertiary)] gap-4">
              <div className="w-6 h-6 border-2 border-t-transparent border-[var(--color-accent-primary)] rounded-full animate-spin" />
              <span className="font-mono text-xs">Loading archives...</span>
            </div>
          ) : filteredAudits.length === 0 ? (
            <div className="glass-panel p-10 rounded-lg text-center flex flex-col items-center gap-3">
              <Clock size={32} className="text-[var(--color-ink-ghost)]" />
              <p className="text-[var(--color-ink-secondary)] font-mono text-sm">
                No historical audits found matching your search.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredAudits.map((audit, idx) => (
                <motion.div
                  key={audit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel p-5 rounded-lg flex items-center justify-between transition-transform duration-300 hover:translate-x-2"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1 w-48">
                      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                        Domain
                      </span>
                      <span className="font-semibold text-sm text-[var(--color-ink-primary)] truncate">
                        {audit.domain}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 w-32">
                      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                        Score
                      </span>
                      {audit.status === "complete" ? (
                        <span className="font-display text-2xl font-bold text-[var(--color-accent-primary)] score-text-glow">
                          {audit.overallScore}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[var(--color-ink-secondary)] capitalize">
                          {audit.status}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 w-48 hidden md:flex">
                      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                        Scan Date
                      </span>
                      <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                        {new Date(audit.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {audit.status === "complete" && (
                    <button className="text-xs font-mono text-[var(--color-accent-copper)] border border-[var(--color-accent-copper-muted)] bg-[var(--color-accent-copper-muted)]/20 px-3 py-1.5 rounded hover:bg-[var(--color-accent-copper-muted)]/60 transition flex items-center gap-1.5">
                      <ExternalLink size={12} /> View Report
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
