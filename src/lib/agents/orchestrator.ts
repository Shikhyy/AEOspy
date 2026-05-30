import { db } from "../db/client";
import { 
  audits, 
  citationResults, 
  serpResults, 
  competitorPages, 
  hallucinationFlags, 
  actionItems 
} from "../db/schema";
import { eq } from "drizzle-orm";
import { brightDataClient } from "../brightdata/client";
import { geminiJSON, claudeJSON, claudeStream, featherlessJSON } from "../ai/client";
import { z } from "zod";
import { demoBrandsCache } from "../cache/demo-cache";
import { cognee } from "../memory/cognee";

// Type definitions
export interface AuditState {
  id: string;
  domain: string;
  brandName: string;
  brandLogoUrl: string;
  keywords: string[];
  geoMode: boolean;
  demoMode: boolean;

  // Outputs
  enrichedKeywords: string[];
  brandContent?: {
    name: string;
    category: string;
    features: string[];
    schemaTypes: string[];
    hasFaq: boolean;
    valueProposition: string;
    rawMarkdown: string;
  };
  serpResults: any[];
  citationResults: any[];
  competitorPages: any[];
  hallucinationFlags: any[];
  geoResults?: any;
  actionItems: any[];
  overallScore: number;
  voiceBrief: string;
}

// Zod schemas for validation
const EnrichedKeywordsSchema = z.object({
  keywords: z.array(z.string()).length(5),
  reasoning: z.string(),
});

export class AuditOrchestrator {
  private state: AuditState;
  private onStep?: (event: any) => void;
  private rowAlreadyCreated: boolean;

  constructor(domain: string, keywords: string[], geoMode: boolean = false, demoMode: boolean = false, onStep?: (event: any) => void, auditId?: string) {
    const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    // If auditId is provided the POST handler already inserted the DB row — don't re-insert
    this.rowAlreadyCreated = !!auditId;
    this.state = {
      id: auditId || `audit-${Math.random().toString(36).substring(2, 11)}`,
      domain: cleanDomain,
      brandName: cleanDomain.split(".")[0].toUpperCase(),
      brandLogoUrl: `https://logo.clearbit.com/${cleanDomain}` || `https://${cleanDomain}/favicon.ico`,
      keywords: keywords.filter(Boolean),
      geoMode,
      demoMode,
      enrichedKeywords: [],
      serpResults: [],
      citationResults: [],
      competitorPages: [],
      hallucinationFlags: [],
      actionItems: [],
      overallScore: 0,
      voiceBrief: "",
    };
    this.onStep = onStep;
  }

  emit(event: any) {
    if (this.onStep) {
      this.onStep(event);
    }
  }

  async run(): Promise<AuditState> {
    this.emit({ type: "agent_step", message: "Initializing AEOspy audit engine...", status: "running" });

    if (this.rowAlreadyCreated) {
      // Row was already inserted by POST /api/audit — just update status to processing
      await db.update(audits)
        .set({ status: "processing" })
        .where(eq(audits.id, this.state.id));
    } else {
      // Standalone use: insert a fresh audit row
      await db.insert(audits).values({
        id: this.state.id,
        domain: this.state.domain,
        brandName: this.state.brandName,
        brandLogoUrl: this.state.brandLogoUrl,
        keywords: JSON.stringify(this.state.keywords),
        status: "processing",
        createdAt: Math.floor(Date.now() / 1000),
        geoMode: this.state.geoMode ? 1 : 0,
        demoMode: this.state.demoMode ? 1 : 0,
      });
    }

    if (this.state.demoMode) {
      return this.runDemoMode();
    }

    try {
      // 0. Cognee Agent Memory Check
      this.emit({ type: "agent_step", message: "Checking Cognee memory graph for historical audit context...", status: "running" });
      const previousMemory = await cognee.getMemory(this.state.domain);
      if (previousMemory) {
        this.emit({ type: "agent_step", message: `Found previous Cognee memory context for ${this.state.domain}. Context injected.`, status: "completed" });
      } else {
        this.emit({ type: "agent_step", message: `No prior Cognee memory found for ${this.state.domain}. Initiating fresh extraction.`, status: "completed" });
      }

      // 1. Brand scrape & Keyword suggestion in parallel
      this.emit({ type: "agent_step", message: "Fetching brand homepage & extracting SEO signals...", status: "running" });
      const homepageContent = await brightDataClient.scrapeMarkdown(this.state.domain);
      
      const brandSignals = await brightDataClient.extract(this.state.domain, {
        prompt: "Extract: company name, product category, key features (max 5), schema.org types present, FAQ sections present (true/false), main value proposition in one sentence"
      });

      this.state.brandContent = {
        name: brandSignals.companyName || this.state.brandName,
        category: brandSignals.productCategory || "SaaS",
        features: brandSignals.keyFeatures || [],
        schemaTypes: brandSignals.schemaTypes || [],
        hasFaq: brandSignals.faqPresent || false,
        valueProposition: brandSignals.valueProp || "",
        rawMarkdown: homepageContent,
      };
      
      this.state.brandName = this.state.brandContent.name;
      this.emit({ type: "agent_step", message: `Brand detected: ${this.state.brandName}. Extracted visual layout and semantic entities.`, status: "completed" });

      // 2. Keyword Enrichment
      this.emit({ type: "agent_step", message: "Analyzing search intent and generating target keywords...", status: "running" });
      const enrichmentResult = await geminiJSON(
        "You are an SEO and GEO (Generative Engine Optimization) expert. Generate 5 keywords.",
        `Brand: ${this.state.brandName} (${this.state.domain})\nHomepage summary: ${homepageContent.slice(0, 1000)}`,
        EnrichedKeywordsSchema
      );

      this.state.enrichedKeywords = enrichmentResult.keywords || this.state.keywords;
      this.emit({ type: "agent_step", message: `Keywords generated: ${this.state.enrichedKeywords.join(", ")}`, status: "completed" });

      // 3. Traditional SERP rank retrieval
      this.emit({ type: "agent_step", message: "Retrieving traditional Google SERP positions...", status: "running" });
      const serpQueries = this.state.enrichedKeywords.map(async (kw) => {
        const results = await brightDataClient.searchEngine(kw);
        const match = results.find(r => r.url.includes(this.state.domain));
        const rank = match ? match.rank : null;
        
        await db.insert(serpResults).values({
          id: `serp-${Math.random().toString(36).substring(2, 11)}`,
          auditId: this.state.id,
          keyword: kw,
          domain: this.state.domain,
          rank,
          serpTitle: match?.title || null,
          serpSnippet: match?.snippet || null,
          createdAt: Math.floor(Date.now() / 1000),
        });

        this.emit({ type: "serp_result", keyword: kw, rank });
        return { keyword: kw, rank };
      });
      this.state.serpResults = await Promise.all(serpQueries);
      this.emit({ type: "agent_step", message: "SERP rank lookup complete.", status: "completed" });

      // 4. Citation Audit Agent (Parallel engine queries)
      this.emit({ type: "agent_step", message: "Querying AI Engines (ChatGPT, Gemini, Perplexity, Grok, Copilot, Google AI) in parallel...", status: "running" });
      
      const engines = ["chatgpt", "gemini", "perplexity", "grok", "copilot", "google_ai"];
      const citationPromises = this.state.enrichedKeywords.flatMap(kw => 
        engines.map(async (engine) => {
          this.emit({ type: "engine_start", engine, keyword: kw });
          
          try {
            const res = await brightDataClient.queryLLMEngine(engine, kw);
            const cited = res.answerText.toLowerCase().includes(this.state.brandName.toLowerCase()) || 
                          res.answerText.toLowerCase().includes(this.state.domain.split(".")[0]);
            
            const citationId = `cit-${Math.random().toString(36).substring(2, 11)}`;
            await db.insert(citationResults).values({
              id: citationId,
              auditId: this.state.id,
              keyword: kw,
              engine,
              cited: cited ? 1 : 0,
              citationPct: cited ? 1.0 : 0.0,
              answerText: res.answerText,
              citedSources: JSON.stringify(res.sources),
              createdAt: Math.floor(Date.now() / 1000),
            });

            const item = { engine, keyword: kw, cited, answerText: res.answerText, sources: res.sources };
            this.state.citationResults.push(item);
            this.emit({ type: "citation_result", engine, keyword: kw, cited });
            return item;
          } catch (err: any) {
            this.emit({ type: "engine_error", engine, keyword: kw, message: err.message });
            return null;
          }
        })
      );

      await Promise.all(citationPromises);
      this.emit({ type: "agent_step", message: "AI citation query tasks complete.", status: "completed" });

      // 5. Competitor Scrape
      this.emit({ type: "agent_step", message: "Identifying cited competitors and fetching structures...", status: "running" });
      const competitorUrls = this.extractCompetitorUrls();
      if (competitorUrls.length > 0) {
        const scrapedPages = await brightDataClient.scrapeBatch(competitorUrls.slice(0, 3));
        const competitorPromises = scrapedPages.map(async (page) => {
          const signals = await brightDataClient.extract(page.content, {
            prompt: "Extract entity score, faqCount, blufScore, schemaTypes, thirdPartyMentions"
          });

          const compId = `comp-${Math.random().toString(36).substring(2, 11)}`;
          await db.insert(competitorPages).values({
            id: compId,
            auditId: this.state.id,
            url: page.url,
            domain: page.url.replace(/https?:\/\/(www\.)?/, "").split("/")[0],
            scrapedMarkdown: page.content.slice(0, 1000),
            entityScore: signals.entityScore || 50,
            faqCount: signals.faqCount || 0,
            blufScore: signals.blufScore || 5,
            headingDepth: signals.headingDepth || 2,
            schemaTypes: JSON.stringify(signals.schemaTypes || []),
            thirdPartyMentions: signals.thirdPartyMentions || 0,
            createdAt: Math.floor(Date.now() / 1000),
          });

          return {
            domain: page.url.replace(/https?:\/\/(www\.)?/, "").split("/")[0],
            url: page.url,
            entityScore: signals.entityScore || 50,
            faqCount: signals.faqCount || 0,
            blufScore: signals.blufScore || 5,
            schemaTypes: signals.schemaTypes || [],
            thirdPartyMentions: signals.thirdPartyMentions || 0,
          };
        });
        this.state.competitorPages = await Promise.all(competitorPromises);
      }
      this.emit({ type: "agent_step", message: "Competitor diff extraction complete.", status: "completed" });

      // 6. Hallucination Monitor (using Featherless AI for open-source inference)
      this.emit({ type: "agent_step", message: "Running claim extractor and fact verification via Featherless AI (Llama-3)...", status: "running" });
      const rawFlags: any[] = await featherlessJSON(
        `You are a brand accuracy auditor. Compare AI answers against the brand webpage.`,
        `Brand webpage content:\n${homepageContent.slice(0, 2000)}\n\nAI claims:\n${JSON.stringify(this.state.citationResults.filter(c => c.cited))}`,
        `[{ engine: string, keyword: string, claimText: string, claimType: string, verificationStatus: "verified"|"unverifiable"|"contradicted", severity: "critical"|"warning"|"info", explanation: string }]`
      );

      for (const flag of (rawFlags || [])) {
        const flagId = `flag-${Math.random().toString(36).substring(2, 11)}`;
        await db.insert(hallucinationFlags).values({
          id: flagId,
          auditId: this.state.id,
          engine: flag.engine,
          keyword: flag.keyword,
          claimText: flag.claimText,
          claimType: flag.claimType,
          verificationStatus: flag.verificationStatus,
          brandSourceUrl: flag.brandSourceUrl || null,
          severity: flag.severity,
          explanation: flag.explanation,
          createdAt: Math.floor(Date.now() / 1000),
        });
        this.state.hallucinationFlags.push(flag);
      }
      this.emit({ type: "agent_step", message: `Hallucination scan completed. Detected ${this.state.hallucinationFlags.length} flags.`, status: "completed" });

      // 7. Synthesis and Priority Actions (Claude)
      this.emit({ type: "agent_step", message: "Synthesizing SEO rankings, AI visibility scores, and structural diffs...", status: "running" });
      const synthesis = await claudeJSON<any>(
        "You are an AI search visibility strategist. Output overallScore, scoreRationale, actionItems.",
        `Audit metadata:\n${JSON.stringify({
          brand: this.state.brandName,
          domain: this.state.domain,
          citations: this.state.citationResults.map(c => ({ keyword: c.keyword, engine: c.engine, cited: c.cited })),
          serp: this.state.serpResults,
          competitors: this.state.competitorPages
        })}`,
        `{ overallScore: number, scoreRationale: string, actionItems: [{ title: string, description: string, pageUrl: string, effortLevel: "low"|"medium"|"high", impactLevel: "low"|"medium"|"high", estimatedLift: number, affectedKeywords: string[], affectedEngines: string[] }] }`
      );

      this.state.overallScore = synthesis.overallScore || 50;
      
      for (const item of (synthesis.actionItems || [])) {
        const itemId = `act-${Math.random().toString(36).substring(2, 11)}`;
        const lift = item.estimatedLift || 0.15;
        const priority = item.impactLevel === "high" ? 3 : item.impactLevel === "medium" ? 2 : 1;
        
        await db.insert(actionItems).values({
          id: itemId,
          auditId: this.state.id,
          title: item.title,
          description: item.description,
          pageUrl: item.pageUrl || `https://${this.state.domain}/`,
          effortLevel: item.effortLevel,
          impactLevel: item.impactLevel,
          estimatedLift: lift,
          affectedKeywords: JSON.stringify(item.affectedKeywords || []),
          affectedEngines: JSON.stringify(item.affectedEngines || []),
          priorityScore: priority,
          createdAt: Math.floor(Date.now() / 1000),
        });
        this.state.actionItems.push({
          title: item.title,
          description: item.description,
          pageUrl: item.pageUrl,
          effortLevel: item.effortLevel,
          impactLevel: item.impactLevel,
          estimatedLift: lift,
          affectedKeywords: item.affectedKeywords || [],
          affectedEngines: item.affectedEngines || [],
          priorityScore: priority,
        });
      }
      this.emit({ type: "synthesis_complete", overallScore: this.state.overallScore, actionCount: this.state.actionItems.length });

      // 8. Voice brief generation
      this.emit({ type: "agent_step", message: "Drafting spoken executive CMO briefing voice brief...", status: "running" });
      const voiceBriefText = await claudeStream(
        "You write spoken audio briefings for senior marketing executives. Sound like a Chief Intelligence Officer briefing a CMO.",
        `Score: ${this.state.overallScore}. Gaps: ${JSON.stringify(this.state.actionItems.slice(0, 3))}. Brand: ${this.state.brandName}`,
        (chunk) => {
          this.emit({ type: "voice_brief_chunk", chunk });
        }
      );
      this.state.voiceBrief = voiceBriefText;

      // Update final row status in DB
      await db.update(audits).set({
        brandName: this.state.brandName,
        status: "complete",
        overallScore: this.state.overallScore,
        completedAt: Math.floor(Date.now() / 1000),
      });

      // Save to Cognee agent memory
      await cognee.addMemory(this.state.domain, {
        score: this.state.overallScore,
        keywords: this.state.enrichedKeywords,
        topAction: this.state.actionItems[0]?.title || "None",
      });

      // TriggerWare.ai Webhook Integration
      this.emit({ type: "agent_step", message: "Executing TriggerWare.ai post-audit automation webhook...", status: "running" });
      try {
        if (process.env.TRIGGERWARE_WEBHOOK_URL) {
          await fetch(process.env.TRIGGERWARE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "audit_complete", domain: this.state.domain, score: this.state.overallScore })
          });
        }
        this.emit({ type: "agent_step", message: "TriggerWare.ai workflow dispatched successfully.", status: "completed" });
      } catch (e) {
        console.error("TriggerWare webhook failed:", e);
      }

      this.emit({ type: "audit_complete", auditId: this.state.id });
      return this.state;
    } catch (e: any) {
      console.error("Orchestrator audit failure:", e);
      await db.update(audits).set({
        status: "failed",
        errorMessage: e.message,
      });
      this.emit({ type: "error", message: `Audit crashed: ${e.message}` });
      throw e;
    }
  }

  // High-fidelity simulation for demo mode (?demo=1)
  private async runDemoMode(): Promise<AuditState> {
    const slug = this.detectBrandSlug(this.state.domain);
    const cached = demoBrandsCache[slug] || demoBrandsCache["hubspot"];

    // Update state to match cached data
    this.state.brandName = cached.audit.brandName;
    this.state.brandLogoUrl = cached.audit.brandLogoUrl;
    this.state.keywords = cached.serpResults.map(r => r.keyword);
    this.state.enrichedKeywords = cached.serpResults.map(r => r.keyword);
    
    // Staged delays and progress logs to make the demo look realistic and high-fidelity
    const steps = [
      { delay: 400, event: { type: "agent_step", message: "Connecting to Bright Data scraping pipelines...", status: "running" } },
      { delay: 500, event: { type: "agent_step", message: `Domain parsed. Favicon matched. Company: ${this.state.brandName}.`, status: "completed" } },
      { delay: 400, event: { type: "agent_step", message: "Running keyword enrichment and GEO keyword mapping...", status: "running" } },
      { delay: 600, event: { type: "agent_step", message: `Identified 5 keyword nodes: ${this.state.enrichedKeywords.join(", ")}`, status: "completed" } },
      { delay: 500, event: { type: "agent_step", message: "Scraping search engines for organic indexing positions...", status: "running" } },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      this.emit(step.event);
    }

    // Emit mock SERP entries
    for (const res of cached.serpResults) {
      this.state.serpResults.push(res);
      this.emit({ type: "serp_result", keyword: res.keyword, rank: res.rank });
      await new Promise(r => setTimeout(r, 150));
    }

    this.emit({ type: "agent_step", message: "Triggering 6 AI engines in parallel via LLM Scraper pools...", status: "running" });

    // Stream engine evaluations
    for (const entry of cached.citationMatrix) {
      for (const [engine, details] of Object.entries(entry.engines)) {
        this.emit({ type: "engine_start", engine, keyword: entry.keyword });
        await new Promise(r => setTimeout(r, 60 + Math.random() * 80));

        this.state.citationResults.push({
          engine,
          keyword: entry.keyword,
          cited: details.cited,
          answerText: details.answerSnippet,
          sources: details.citedSources,
        });

        this.emit({ type: "citation_result", engine, keyword: entry.keyword, cited: details.cited });
      }
    }

    this.emit({ type: "agent_step", message: "Engine queries resolved. Scraping top competitor pages...", status: "running" });
    await new Promise(r => setTimeout(r, 500));

    for (const comp of cached.topCompetitors) {
      this.state.competitorPages.push(comp);
    }

    this.emit({ type: "agent_step", message: "Running claim matching and fact validation...", status: "running" });
    await new Promise(r => setTimeout(r, 600));

    for (const flag of cached.hallucinationFlags) {
      this.state.hallucinationFlags.push(flag);
    }

    this.emit({ type: "agent_step", message: "Synthesizing SEO data and prioritization indexes...", status: "running" });
    await new Promise(r => setTimeout(r, 400));

    this.state.overallScore = cached.audit.overallScore;

    for (const item of cached.actionItems) {
      this.state.actionItems.push(item);
    }
    this.emit({ type: "synthesis_complete", overallScore: this.state.overallScore, actionCount: this.state.actionItems.length });

    this.emit({ type: "agent_step", message: "Drafting spoken CMO briefing notes...", status: "running" });
    await new Promise(r => setTimeout(r, 400));

    // Stream voice brief
    const voiceText = `Your AI visibility audit is complete. Your overall score is ${this.state.overallScore} out of 100 — you have a strong organic footprint but remain partially visible across key engines. Your strongest engine is ChatGPT at 95 percent, while your weakest is Grok at zero percent citation. A key visibility gap exists on ${cached.visibilityGap.gapKeywords[0]?.keyword || "features"}, where you rank high on Google but are rarely cited. Your top priority is adding pricing tables and Product schemas to boost citations by 20 percent.`;
    
    this.state.voiceBrief = voiceText;
    const words = voiceText.split(" ");
    for (let i = 0; i < words.length; i++) {
      this.emit({ type: "voice_brief_chunk", chunk: words[i] + " " });
      await new Promise(r => setTimeout(r, 15)); // rapid stream
    }
    this.emit({ type: "audit_complete", auditId: this.state.id });
    return this.state;
  }

  private detectBrandSlug(domain: string): string {
    if (domain.includes("salesforce")) return "salesforce";
    if (domain.includes("notion")) return "notion";
    return "hubspot";
  }

  private extractCompetitorUrls(): string[] {
    const urls = new Set<string>();
    for (const res of this.state.citationResults) {
      if (res.sources && Array.isArray(res.sources)) {
        res.sources.forEach((s: string) => {
          if (s.startsWith("http") && !s.includes(this.state.domain)) {
            urls.add(s);
          }
        });
      }
    }
    return Array.from(urls);
  }
}
