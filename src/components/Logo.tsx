import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

export function Logo({ size = "md", withText = true }: { size?: "sm" | "md" | "lg", withText?: boolean }) {
  const iconSize = size === "sm" ? 14 : size === "md" ? 16 : 22;
  const textSize = size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-3xl";
  const dim = size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : "w-14 h-14";

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className={`relative flex items-center justify-center ${dim} shrink-0`}>
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-[var(--color-accent-primary)]/50 border-t-[var(--color-accent-primary)] shadow-[0_0_15px_rgba(61,107,79,0.4)] group-hover:shadow-[0_0_25px_rgba(61,107,79,0.8)] transition-all"
        />
        {/* Inner reverse rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1.5 rounded-full border border-[var(--color-accent-copper)]/30 border-b-[var(--color-accent-copper)]"
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 m-auto flex items-center justify-center z-10">
          <Radar size={iconSize} className="text-[var(--color-ink-primary)]" />
        </div>
      </div>
      
      {withText && (
        <div className="flex flex-col justify-center">
          <span className={`font-display italic tracking-wide font-semibold text-gradient-primary leading-none ${textSize}`}>
            AEOspy
          </span>
          <span className="text-[8px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-[0.2em] mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
            Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
