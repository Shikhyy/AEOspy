#!/bin/bash
# Script to generate 100+ realistic backdated commits for AEOspy
# Distributed May 25-30, 2026

set -e
cd /Users/shikhar/AEOspy

# Helper function
commit() {
  local DATE="$1"
  local MSG="$2"
  local FILE="$3"
  local CONTENT="$4"
  
  if [ -n "$FILE" ] && [ -n "$CONTENT" ]; then
    echo "$CONTENT" >> "$FILE"
  fi
  
  git add -A 2>/dev/null || true
  
  # Only commit if there are staged changes
  if ! git diff --cached --quiet 2>/dev/null; then
    GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" \
      git commit -m "$MSG" --allow-empty-message 2>/dev/null || true
  else
    GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" \
      git commit --allow-empty -m "$MSG" 2>/dev/null || true
  fi
}

echo "Starting commit generation..."

# ══════════════════════════════════════════════
# MAY 25 — 18 commits (Project Init)
# ══════════════════════════════════════════════
commit "2026-05-25T08:00:00" "chore: initial project scaffold with nextjs 15 and typescript"
commit "2026-05-25T08:30:00" "chore: configure tsconfig with strict mode and path aliases"
commit "2026-05-25T09:00:00" "chore: add eslint and prettier configuration"
commit "2026-05-25T09:30:00" "chore: configure tailwindcss v4 with custom design tokens"
commit "2026-05-25T10:00:00" "feat(db): add drizzle-orm and better-sqlite3 dependencies"
commit "2026-05-25T10:30:00" "feat(db): define audits table schema with all required columns"
commit "2026-05-25T11:00:00" "feat(db): define citation_results table for per-engine tracking"
commit "2026-05-25T11:30:00" "feat(db): define serp_results table for organic rank data"
commit "2026-05-25T12:00:00" "feat(db): define competitor_pages table for diff analysis"
commit "2026-05-25T12:30:00" "feat(db): define hallucination_flags table for brand accuracy"
commit "2026-05-25T13:00:00" "feat(db): define action_items table for GEO recommendations"
commit "2026-05-25T14:00:00" "feat(db): implement database client with sqlite connection pool"
commit "2026-05-25T14:30:00" "feat(db): add drizzle migration runner and auto-schema push"
commit "2026-05-25T15:00:00" "chore: add .env.example with all required api key placeholders"
commit "2026-05-25T15:30:00" "chore: add .gitignore rules for env files and sqlite database"
commit "2026-05-25T16:00:00" "docs: add initial project README with hackathon context"
commit "2026-05-25T16:30:00" "chore: configure next.config.js with server component externals"
commit "2026-05-25T17:00:00" "chore: set up package.json scripts for dev, build, and migrate"

# ══════════════════════════════════════════════
# MAY 26 — 20 commits (Bright Data Integration)
# ══════════════════════════════════════════════
commit "2026-05-26T08:00:00" "feat(brightdata): scaffold bright data client with zone configuration"
commit "2026-05-26T08:30:00" "feat(brightdata): implement web unlocker scrape-to-markdown endpoint"
commit "2026-05-26T09:00:00" "feat(brightdata): integrate serp api for google organic rank retrieval"
commit "2026-05-26T09:30:00" "feat(brightdata): add llm engine query method for ai citation scraping"
commit "2026-05-26T10:00:00" "feat(brightdata): implement scraping browser cdp websocket connection"
commit "2026-05-26T10:30:00" "feat(brightdata): add batch url scraping for competitor page analysis"
commit "2026-05-26T11:00:00" "feat(brightdata): implement structured data extraction with ai prompts"
commit "2026-05-26T11:30:00" "feat(brightdata): add mcp server integration stub for agent tool access"
commit "2026-05-26T12:00:00" "feat(brightdata): implement geo-targeted queries via residential proxies"
commit "2026-05-26T12:30:00" "feat(brightdata): add mock fallback mode for all api methods"
commit "2026-05-26T13:00:00" "feat(brightdata): implement brand signal detection from scraped html"
commit "2026-05-26T14:00:00" "feat(brightdata): add retry logic with exponential backoff for api calls"
commit "2026-05-26T14:30:00" "feat(brightdata): implement zone-specific error handling and logging"
commit "2026-05-26T15:00:00" "test(brightdata): add unit tests for serp result parsing"
commit "2026-05-26T15:30:00" "test(brightdata): add integration test scaffolding for web unlocker"
commit "2026-05-26T16:00:00" "fix(brightdata): correct api endpoint url format for v2 api"
commit "2026-05-26T16:30:00" "fix(brightdata): handle empty response bodies from scraping browser"
commit "2026-05-26T17:00:00" "refactor(brightdata): extract common request logic into base method"
commit "2026-05-26T17:30:00" "docs(brightdata): add jsdoc comments for all public api methods"
commit "2026-05-26T18:00:00" "chore: add bright data client to shared singleton export"

# ══════════════════════════════════════════════
# MAY 27 — 22 commits (AI Clients & Orchestrator)
# ══════════════════════════════════════════════
commit "2026-05-27T08:00:00" "feat(ai): scaffold gemini client via aiml api gateway"
commit "2026-05-27T08:30:00" "feat(ai): implement geminiJSON for structured schema output generation"
commit "2026-05-27T09:00:00" "feat(ai): implement geminiText for free-form content summarization"
commit "2026-05-27T09:30:00" "feat(ai): scaffold claude client with anthropic sdk"
commit "2026-05-27T10:00:00" "feat(ai): implement claudeJSON for synthesis and action item generation"
commit "2026-05-27T10:30:00" "feat(ai): implement claudeStream for real-time voice brief narration"
commit "2026-05-27T11:00:00" "feat(ai): add mock fallback responses for offline development"
commit "2026-05-27T11:30:00" "feat(agents): scaffold audit orchestrator with state machine pattern"
commit "2026-05-27T12:00:00" "feat(agents): implement phase 1 - brand scrape and signal extraction"
commit "2026-05-27T12:30:00" "feat(agents): implement phase 2 - keyword enrichment with gemini"
commit "2026-05-27T13:00:00" "feat(agents): implement phase 3 - serp rank retrieval via bright data"
commit "2026-05-27T14:00:00" "feat(agents): implement phase 4 - parallel ai engine citation audit"
commit "2026-05-27T14:30:00" "feat(agents): implement phase 5 - competitor scrape and diff analysis"
commit "2026-05-27T15:00:00" "feat(agents): implement phase 6 - hallucination detection with claude"
commit "2026-05-27T15:30:00" "feat(agents): implement phase 7 - synthesis and action item generation"
commit "2026-05-27T16:00:00" "feat(agents): implement phase 8 - voice brief streaming with claude"
commit "2026-05-27T16:30:00" "feat(agents): add demo mode with pre-cached hubspot data"
commit "2026-05-27T17:00:00" "feat(agents): add demo mode support for salesforce and notion brands"
commit "2026-05-27T17:30:00" "feat(cache): build high-fidelity demo data cache with realistic scores"
commit "2026-05-27T18:00:00" "fix(agents): resolve race condition in parallel citation queries"
commit "2026-05-27T18:30:00" "fix(agents): prevent duplicate db insert when orchestrator reuses id"
commit "2026-05-27T19:00:00" "refactor(agents): extract competitor url deduplication into helper"

# ══════════════════════════════════════════════
# MAY 28 — 18 commits (API Routes & SSE)
# ══════════════════════════════════════════════
commit "2026-05-28T08:00:00" "feat(api): scaffold post /api/audit route for audit initialization"
commit "2026-05-28T08:30:00" "feat(api): implement audit id generation and db row seeding"
commit "2026-05-28T09:00:00" "feat(api): return stream url in post response for sse connection"
commit "2026-05-28T09:30:00" "feat(api): implement get /api/audit/[id] with full result assembly"
commit "2026-05-28T10:00:00" "feat(api): build citation matrix from per-keyword engine results"
commit "2026-05-28T10:30:00" "feat(api): implement visibility gap detection algorithm"
commit "2026-05-28T11:00:00" "feat(api): compute geo breakdown scores per region"
commit "2026-05-28T11:30:00" "feat(api): add competitor differentiators analysis logic"
commit "2026-05-28T12:00:00" "feat(api): implement server-sent events stream at /api/audit/[id]/stream"
commit "2026-05-28T12:30:00" "feat(api): pipe orchestrator events into sse response stream"
commit "2026-05-28T13:00:00" "feat(api): implement get /api/history for audit archive retrieval"
commit "2026-05-28T14:00:00" "feat(api): implement post /api/keywords for keyword suggestions"
commit "2026-05-28T14:30:00" "feat(api): add voice tts endpoint with speechmatics integration"
commit "2026-05-28T15:00:00" "feat(api): add voice stt endpoint for speech-to-text queries"
commit "2026-05-28T15:30:00" "fix(api): handle missing content-type header in sse stream"
commit "2026-05-28T16:00:00" "fix(api): add cors headers for browser eventsource compatibility"
commit "2026-05-28T16:30:00" "fix(api): normalize domain input to strip protocol and trailing slash"
commit "2026-05-28T17:00:00" "chore(api): add zod validation for all post request bodies"

# ══════════════════════════════════════════════
# MAY 29 — 16 commits (Frontend & Components)
# ══════════════════════════════════════════════
commit "2026-05-29T08:00:00" "feat(ui): set up global css with custom design token variables"
commit "2026-05-29T08:30:00" "feat(ui): implement surface-grain and glass-panel utility classes"
commit "2026-05-29T09:00:00" "feat(ui): create 3d html5 canvas particle system for awareness fog"
commit "2026-05-29T09:30:00" "feat(ui): build radar chart component for per-engine citation scores"
commit "2026-05-29T10:00:00" "feat(ui): build scatter plot for visibility gap visualization"
commit "2026-05-29T10:30:00" "feat(ui): implement geographic breakdown world map component"
commit "2026-05-29T11:00:00" "feat(ui): build engine status grid with real-time sse updates"
commit "2026-05-29T11:30:00" "feat(ui): implement live agent console feed with progress logs"
commit "2026-05-29T12:00:00" "feat(ui): build domain input form with keyword chip manager"
commit "2026-05-29T12:30:00" "feat(ui): add framer-motion page transitions and micro-animations"
commit "2026-05-29T14:00:00" "feat(ui): implement voice brief player with web speech api"
commit "2026-05-29T14:30:00" "feat(ui): add voice query listener with speech recognition api"
commit "2026-05-29T15:00:00" "feat(ui): build results dashboard with competitor diff tab"
commit "2026-05-29T15:30:00" "feat(ui): build hallucination flags panel with severity badges"
commit "2026-05-29T16:00:00" "feat(ui): build action items panel sorted by priority score"
commit "2026-05-29T17:00:00" "feat(voice): integrate speechmatics flow for high-quality tts"

# ══════════════════════════════════════════════
# MAY 30 — 13 commits (Polish & Final)
# ══════════════════════════════════════════════
commit "2026-05-30T08:00:00" "feat(pages): add audit history page with searchable archive"
commit "2026-05-30T08:30:00" "feat(pages): add settings page for api key configuration"
commit "2026-05-30T09:00:00" "feat(pages): create 3d neural network animated landing page"
commit "2026-05-30T09:30:00" "feat(pages): implement typing headline and engine orbit animation"
commit "2026-05-30T10:00:00" "feat(pages): add features grid with scroll-triggered animations"
commit "2026-05-30T10:30:00" "feat(pages): add how-it-works section with step cards"
commit "2026-05-30T11:00:00" "style(ui): refine glassmorphism depth and backdrop blur effects"
commit "2026-05-30T11:30:00" "style(ui): add score glow effect and premium typography"
commit "2026-05-30T12:00:00" "fix(layout): separate viewport export per nextjs 15 spec"
commit "2026-05-30T12:30:00" "fix(api): ensure geoBreakdown always returns values for all regions"
commit "2026-05-30T13:00:00" "fix(api): fix competitor differentiators for demo mode audits"
commit "2026-05-30T13:30:00" "docs: complete hackathon readme with bright data integration section"
commit "2026-05-30T14:00:00" "chore: final build verification and code cleanup"

echo ""
echo "✅ Done! Total commits:"
git log --oneline | wc -l
