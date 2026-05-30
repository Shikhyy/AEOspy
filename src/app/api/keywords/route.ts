import { NextRequest, NextResponse } from "next/server";
import { brightDataClient } from "@/lib/brightdata/client";
import { geminiJSON } from "@/lib/ai/client";
import { z } from "zod";

const KeywordSuggestionsSchema = z.object({
  keywords: z.array(z.string()).length(5),
  reasoning: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    
    // Scrape homepage content
    const homepageContent = await brightDataClient.scrapeMarkdown(cleanDomain);

    // Call Keyword Enrichment prompt
    const systemPrompt = `You are a GEO (Generative Engine Optimization) strategist. Generate exactly 5 keywords optimized for AI search engines based on the company's homepage.`;
    const userMessage = `Brand: ${cleanDomain.split(".")[0]} (${cleanDomain})\nContent summary:\n${homepageContent.slice(0, 1500)}`;
    
    const result = await geminiJSON(systemPrompt, userMessage, KeywordSuggestionsSchema);

    return NextResponse.json({
      keywords: result.keywords,
      reasoning: result.reasoning,
    });
  } catch (error: any) {
    console.error("POST /api/keywords error:", error);
    // Simple fallback list if something breaks
    return NextResponse.json({
      keywords: [
        "best CRM software solutions",
        "custom pipeline management tool",
        "CRM with email tracking features",
        "sales pipeline automation",
        "top CRM system for startups"
      ],
      reasoning: "Fallback suggestion based on standard CRM intents.",
    });
  }
}
