import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const audits = sqliteTable("audits", {
  id: text("id").primaryKey(), // nanoid or custom short ID
  domain: text("domain").notNull(),
  brandName: text("brand_name"),
  brandLogoUrl: text("brand_logo_url"),
  keywords: text("keywords").notNull(), // JSON array of keywords
  status: text("status").notNull().default("pending"), // pending | processing | complete | failed
  overallScore: integer("overall_score"),
  createdAt: integer("created_at").notNull(),
  completedAt: integer("completed_at"),
  errorMessage: text("error_message"),
  geoMode: integer("geo_mode").default(0), // 0 = false, 1 = true
  demoMode: integer("demo_mode").default(0), // 0 = false, 1 = true
});

export const citationResults = sqliteTable("citation_results", {
  id: text("id").primaryKey(),
  auditId: text("audit_id").notNull().references(() => audits.id),
  keyword: text("keyword").notNull(),
  engine: text("engine").notNull(), // chatgpt | gemini | perplexity | grok | copilot | google_ai
  cited: integer("cited").notNull(), // 0 = false, 1 = true
  citationPct: real("citation_pct"),
  answerText: text("answer_text"),
  citedSources: text("cited_sources"), // JSON array of URLs
  geo: text("geo").default("us"),
  latencyMs: integer("latency_ms"),
  createdAt: integer("created_at").notNull(),
});

export const serpResults = sqliteTable("serp_results", {
  id: text("id").primaryKey(),
  auditId: text("audit_id").notNull().references(() => audits.id),
  keyword: text("keyword").notNull(),
  domain: text("domain").notNull(),
  rank: integer("rank"), // null if not in top 20
  serpTitle: text("serp_title"),
  serpSnippet: text("serp_snippet"),
  createdAt: integer("created_at").notNull(),
});

export const competitorPages = sqliteTable("competitor_pages", {
  id: text("id").primaryKey(),
  auditId: text("audit_id").notNull().references(() => audits.id),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  scrapedMarkdown: text("scraped_markdown"),
  entityScore: integer("entity_score"),
  faqCount: integer("faq_count"),
  blufScore: integer("bluf_score"),
  headingDepth: integer("heading_depth"),
  schemaTypes: text("schema_types"), // JSON array
  thirdPartyMentions: integer("third_party_mentions"),
  createdAt: integer("created_at").notNull(),
});

export const hallucinationFlags = sqliteTable("hallucination_flags", {
  id: text("id").primaryKey(),
  auditId: text("audit_id").notNull().references(() => audits.id),
  engine: text("engine").notNull(),
  keyword: text("keyword").notNull(),
  claimText: text("claim_text").notNull(),
  claimType: text("claim_type"), // factual | numerical | descriptive
  verificationStatus: text("verification_status").notNull(), // verified | unverifiable | contradicted
  brandSourceUrl: text("brand_source_url"),
  severity: text("severity").notNull(), // critical | warning | info
  explanation: text("explanation"),
  createdAt: integer("created_at").notNull(),
});

export const actionItems = sqliteTable("action_items", {
  id: text("id").primaryKey(),
  auditId: text("audit_id").notNull().references(() => audits.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pageUrl: text("page_url"),
  effortLevel: text("effort_level").notNull(), // low | medium | high
  impactLevel: text("impact_level").notNull(), // low | medium | high
  estimatedLift: real("estimated_lift"),
  affectedKeywords: text("affected_keywords"), // JSON array
  affectedEngines: text("affected_engines"), // JSON array
  priorityScore: real("priority_score"),
  createdAt: integer("created_at").notNull(),
});

export const demoCache = sqliteTable("demo_cache", {
  id: text("id").primaryKey(),
  brandSlug: text("brand_slug").unique().notNull(), // salesforce | hubspot | notion
  auditJson: text("audit_json").notNull(),
  createdAt: integer("created_at").notNull(),
});
