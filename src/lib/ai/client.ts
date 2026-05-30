import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";

// Create OpenAI-compatible client for AI/ML API (Gemini)
const aimlApiKey = process.env.AIML_API_KEY || "";
const aimlClient = createOpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: aimlApiKey,
});
const GEMINI_MODEL = "gemini-1.5-flash";

// Create OpenAI-compatible client for Featherless AI
const featherlessApiKey = process.env.FEATHERLESS_API_KEY || "";
const featherlessClient = createOpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: featherlessApiKey,
});
const FEATHERLESS_MODEL = "meta-llama/Meta-Llama-3-70B-Instruct";
// Direct Anthropic setup
const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";

export async function geminiJSON<T extends z.ZodType>(
  systemPrompt: string,
  userMessage: string,
  schema: T
): Promise<z.infer<T>> {
  if (!aimlApiKey) {
    // Return mock fallback
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simulate keyword enrichment response
    if (userMessage.includes("seedKeywords") || userMessage.includes("Generate 5 keywords")) {
      const brandNameMatch = userMessage.match(/Brand:\s*(\w+)/i);
      const brand = brandNameMatch ? brandNameMatch[1] : "My Brand";
      const domainMatch = userMessage.match(/domain:\s*([\w\.]+)/i);
      const domain = domainMatch ? domainMatch[1] : "brand.com";
      const brandLower = brand.toLowerCase();

      return {
        keywords: [
          `best ${brandLower} CRM alternative`,
          `how to track sales pipelines in ${brandLower}`,
          `top visual pipeline tracker for startups`,
          `${brandLower} pricing and seat options`,
          `CRM software with email tracking features`
        ],
        reasoning: `Extracted core CRM focus from homepage content for brand ${brand}. Generated keywords targeting customer intent.`,
      } as any;
    }

    // Simulate page entity extraction response
    if (userMessage.includes("PAGE CONTENT")) {
      return {
        entityScore: 80,
        faqCount: 5,
        blufScore: 9,
        headingDepth: 3,
        schemaTypes: ["Organization", "FAQPage", "WebPage"],
        thirdPartyMentions: 15,
        keyValueProposition: "A powerful, unified system to automate sales pipeline tasks and improve CRM workflows.",
        wordCount: 850,
      } as any;
    }

    // Simulate citation answer analysis
    if (userMessage.includes("AI ENGINE ANSWER")) {
      const brandNameMatch = userMessage.match(/BRAND TO FIND:\s*(\w+)/i);
      const brand = brandNameMatch ? brandNameMatch[1] : "Brand";
      const isMentioned = Math.random() > 0.4;
      return {
        brandMentioned: isMentioned,
        mentionContext: isMentioned ? "primary_recommendation" : "none",
        competitorsMentioned: ["Zoho CRM", "Salesforce"],
        answerConfidence: "high",
        sourcesReferenced: isMentioned ? [`https://www.${brand.toLowerCase()}.com/`] : [],
        sentimentTowardBrand: isMentioned ? "positive" : "not_applicable",
      } as any;
    }

    throw new Error("Missing mock resolver for Gemini JSON schema");
  }

  const { object } = await generateObject({
    model: aimlClient(GEMINI_MODEL),
    system: systemPrompt,
    prompt: userMessage,
    schema,
  });
  return object as z.infer<T>;
}

export async function geminiText(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024
): Promise<string> {
  if (!aimlApiKey) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return `This is a friendly, formatted recommendation: Make your features easy to extract by adding clear bullet points.`;
  }

  const { text } = await generateText({
    model: aimlClient(GEMINI_MODEL),
    system: systemPrompt,
    prompt: userMessage,
  });
  return text;
}

export async function claudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  schemaPrompt?: string
): Promise<T> {
  if (!anthropicApiKey) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if it is gap analysis synthesis
    if (userMessage.includes("CITATION RESULTS")) {
      const brandNameMatch = userMessage.match(/BRAND:\s*(\w+)/i);
      const brand = brandNameMatch ? brandNameMatch[1] : "HubSpot";
      const domainMatch = userMessage.match(/domain:\s*([\w\.]+)/i);
      const domain = domainMatch ? domainMatch[1] : "hubspot.com";

      const mockData = {
        overallScore: 68,
        scoreRationale: `Your brand has good search visibility but is cited in only 40% of AI engine answers due to lack of transparent schema metadata.`,
        visibilityGaps: [
          { keyword: "free sales pipeline tool", serpRank: 2, avgCitationPct: 0.35, gapSeverity: "HIGH" },
          { keyword: `${brand.toLowerCase()} pricing`, serpRank: 1, avgCitationPct: 0.5, gapSeverity: "MEDIUM" }
        ],
        competitorDiff: [
          { competitorDomain: "zoho.com", advantages: ["Explicit feature counts in landing headers", "Structured FAQ schema markup"], citedKeywords: ["free sales pipeline tool"] }
        ],
        actionItems: [
          {
            id: "act-1",
            title: "Add pricing details in a structured table with Product schema",
            description: `AI scrapers are failing to extract your pricing plans. Adding a pricing comparison table wrapped in Product schema on your pricing page will improve citations on Perplexity and ChatGPT.`,
            pageUrl: `https://www.${domain}/pricing`,
            effortLevel: "low",
            impactLevel: "high",
            estimatedLift: 0.22,
            affectedKeywords: [`${brand.toLowerCase()} pricing`],
            affectedEngines: ["chatgpt", "perplexity"],
            priorityScore: 3.0
          },
          {
            id: "act-2",
            title: "Create an FAQ page with Q&A schema markup",
            description: `Competitors are cited because they list Q&A markup about features. Implementing FAQPage schema on your features page will allow Google AI and Gemini to parse answers directly.`,
            pageUrl: `https://www.${domain}/features`,
            effortLevel: "medium",
            impactLevel: "medium",
            estimatedLift: 0.15,
            affectedKeywords: ["best team wiki tool"],
            affectedEngines: ["gemini", "google_ai"],
            priorityScore: 1.5
          }
        ]
      };
      return mockData as unknown as T;
    }

    // Check if it is hallucination check
    if (userMessage.includes("Check these AI-generated claims")) {
      const brandNameMatch = userMessage.match(/Check these AI-generated claims about\s*(\w+)/i);
      const brand = brandNameMatch ? brandNameMatch[1] : "Brand";

      return [
        {
          engine: "chatgpt",
          keyword: "enterprise CRM software",
          claimText: `${brand} offers 24/7 direct phone support for all free-tier accounts.`,
          claimType: "factual",
          verificationStatus: "contradicted",
          brandSourceUrl: null,
          severity: "critical",
          explanation: `${brand} only provides phone support for paid Enterprise plans. This claim is contradicted by your support page.`
        }
      ] as unknown as T;
    }

    return {} as T;
  }

  // Real Claude API call using Anthropic Node SDK
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: anthropicApiKey });
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    system: systemPrompt + (schemaPrompt ? `\n\nReturn ONLY valid JSON matching this schema:\n${schemaPrompt}` : ''),
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean) as T;
}

export async function featherlessJSON<T>(
  systemPrompt: string,
  userMessage: string,
  schemaPrompt: string
): Promise<T> {
  if (!featherlessApiKey) {
    // If no key, fallback to Claude JSON mock for hallucinations
    return await claudeJSON<T>(systemPrompt, userMessage, schemaPrompt);
  }

  // Featherless AI API for open-source models (e.g. Llama-3)
  const { text } = await generateText({
    model: featherlessClient(FEATHERLESS_MODEL),
    system: systemPrompt + `\n\nReturn ONLY valid JSON matching this schema:\n${schemaPrompt}`,
    prompt: userMessage,
  });

  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean) as T;
}

export async function claudeStream(
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void
): Promise<string> {
  if (!anthropicApiKey) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockSpeech = `Your AI visibility audit is complete. Your overall score is 68 percent — you have a strong organic presence but your AI footprint remains average. Your best performing engine is ChatGPT at 90 percent citation, while your weakest is Grok at zero percent. We detected a major visibility gap for 'free sales pipeline tool' where you rank number two on Google but are cited in only 35 percent of answers. Your top priority is adding a pricing table and Product schema, which should increase citations by 22 percent. Would you like me to compile the complete content brief?`;
    
    // Simulate streaming chunks
    const words = mockSpeech.split(" ");
    for (let i = 0; i < words.length; i++) {
      onChunk(words[i] + " ");
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return mockSpeech;
  }

  // Real Anthropic stream
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: anthropicApiKey });
  const stream = client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  let fullText = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      onChunk(chunk.delta.text);
      fullText += chunk.delta.text;
    }
  }
  return fullText;
}
