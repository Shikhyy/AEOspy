import React from "react";
import { Bot, Sparkles, Network, Search, Zap, Globe } from "lucide-react";

export function EcosystemMarquee() {
  const ITEMS = [
    { name: "ChatGPT Plus", icon: Bot, color: "#10A37F" },
    { name: "Gemini Advanced", icon: Sparkles, color: "#8E24AA" },
    { name: "Perplexity Pro", icon: Search, color: "#22B8CD" },
    { name: "Claude 3 Opus", icon: Network, color: "#D97757" },
    { name: "Microsoft Copilot", icon: Zap, color: "#0067B8" },
    { name: "Meta Llama 3", icon: Globe, color: "#0668E1" },
  ];

  // Double the array for seamless infinite scroll
  const DUPED_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="w-full overflow-hidden relative py-12 flex flex-col items-center">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-bg-base)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-bg-base)] to-transparent z-10 pointer-events-none" />
      
      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-widest mb-6">
        Integrated Answer Engines
      </span>
      
      <div className="flex w-[300%] md:w-[200%] animate-infinite-scroll">
        <div className="flex w-1/2 justify-around items-center shrink-0">
          {DUPED_ITEMS.slice(0, ITEMS.length * 1.5).map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-8 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
              <item.icon size={20} style={{ color: item.color }} />
              <span className="font-display font-medium tracking-wide text-lg text-[var(--color-ink-secondary)]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center shrink-0">
          {DUPED_ITEMS.slice(ITEMS.length * 1.5).map((item, i) => (
            <div key={i + 100} className="flex items-center gap-3 px-8 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default">
              <item.icon size={20} style={{ color: item.color }} />
              <span className="font-display font-medium tracking-wide text-lg text-[var(--color-ink-secondary)]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
