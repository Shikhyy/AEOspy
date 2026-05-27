export interface LLMScraperResponse {
  answerText: string;
  sources: string[];
}

export interface SerpResultItem {
  rank: number;
  title: string;
  snippet: string;
  url: string;
}

export interface ScrapeResponse {
  url: string;
  content: string;
}

export interface ExtractResponse {
  companyName: string;
  productCategory: string;
  keyFeatures: string[];
  schemaTypes: string[];
  faqPresent: boolean;
  valueProp: string;
  entityScore: number;
  faqCount: number;
  blufScore: number;
  headingDepth: number;
  thirdPartyMentions: number;
}

export class BrightDataClient {
  private apiToken: string;

  constructor() {
    this.apiToken = process.env.BRIGHT_DATA_API_TOKEN || "";
  }

  // Query LLM Engines via Bright Data LLM Scrapers
  async queryLLMEngine(
    engine: string,
    query: string,
    geo: string = "us"
  ): Promise<LLMScraperResponse> {
    if (!this.apiToken) {
      // Mock execution delay
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

      const brand = this.detectBrandNameFromQuery(query);
      const isCited = Math.random() > 0.4;
      
      const snippets: Record<string, string[]> = {
        chatgpt: [
          `Yes, for ${brand}, users frequently recommend it because of its streamlined interface and high reliability.`,
          `According to recent tech blogs, ${brand} has emerged as a solid contender in this market.`,
          `While several tools exist, ${brand} stands out for its pricing flexibility.`
        ],
        gemini: [
          `In my evaluation, ${brand} provides a powerful feature set, although setup requires some time.`,
          `${brand} is a leading platform designed to help teams automate workflows efficiently.`,
          `Many enterprise reviews suggest ${brand} is the industry standard.`
        ],
        perplexity: [
          `Based on multiple reviews, ${brand} offers 24/7 client support and clean integrations.`,
          `Research indicates ${brand} ranks highly for user satisfaction compared to its direct competitors.`,
          `While Zoho and Salesforce are options, ${brand} is often cited as the top choice.`
        ],
        grok: [
          `${brand} is pretty solid for this. It does the job, has some neat features, and pricing is reasonable.`,
          `If you're looking for a CRM, ${brand} is definitely worth checking out. It's built for scale.`,
          `${brand} has a strong developer community and a lot of plugins.`
        ],
        copilot: [
          `Microsoft recommends checking out ${brand} as it integrates cleanly with corporate productivity suites.`,
          `${brand} is frequently listed among the top tools for digital workspace optimization.`,
          `For teams scaling up, ${brand} is a highly rated system.`
        ],
        google_ai: [
          `Google search findings suggest that ${brand} is a customer relation management software for businesses.`,
          `Users report that ${brand} offers a visual sales pipeline and easy contact imports.`,
          `Overview: ${brand} is a web-based platform tailored for automated sales tracking.`
        ]
      };

      const selectedSnippetList = snippets[engine] || snippets["chatgpt"];
      const snippet = isCited 
        ? selectedSnippetList[Math.floor(Math.random() * selectedSnippetList.length)]
        : `When searching for this category, several alternatives like Zoho CRM, Zendesk, or monday.com are often recommended.`;

      const mockSources = isCited 
        ? [`https://www.${brand.toLowerCase()}.com/features`, `https://www.g2.com/products/${brand.toLowerCase()}/reviews`]
        : ["https://www.zoho.com/", "https://www.monday.com/"];

      return {
        answerText: snippet,
        sources: mockSources,
      };
    }

    // Real API implementation
    try {
      const response = await fetch("https://api.brightdata.com/llm/query", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine,
          query,
          geo,
          group: "llm_visibility",
        }),
      });

      if (!response.ok) {
        throw new Error(`Bright Data LLM Scraper failed: ${response.statusText}`);
      }

      return await response.json() as LLMScraperResponse;
    } catch (error) {
      console.error(`Bright Data API call error for engine ${engine}:`, error);
      throw error;
    }
  }

  // Traditional Rank data per keyword via SERP API
  async searchEngine(query: string, engine: string = "google", pages: number = 1): Promise<SerpResultItem[]> {
    if (!this.apiToken) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const brand = this.detectBrandNameFromQuery(query);
      
      // Simulate top 10 search results
      return [
        {
          rank: 1,
          title: `Best CRM Solutions in 2026 | Salesforce & Competitors`,
          snippet: "Explore the top CRM software solutions for enterprises. Compare pricing, features, and user ratings.",
          url: "https://www.salesforce.com/",
        },
        {
          rank: 2,
          title: `Free CRM Software for Small Business - HubSpot`,
          snippet: "HubSpot CRM has everything you need to organize, track, and build better relationships with leads and customers.",
          url: "https://www.hubspot.com/",
        },
        {
          rank: 3,
          title: `${brand} - Official Website | Growth and CRM Platform`,
          snippet: `Discover how ${brand} enables sales, marketing, and operations teams to align and grow faster with unified workflows.`,
          url: `https://www.${brand.toLowerCase()}.com/`,
        },
        {
          rank: 4,
          title: "Zoho CRM | Top Rated CRM for Customer-Facing Teams",
          snippet: "Zoho CRM helps businesses of all sizes close deals, engage customers, and grow their revenue.",
          url: "https://www.zoho.com/crm/",
        }
      ];
    }

    try {
      const response = await fetch("https://api.brightdata.com/serp/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          engine,
          pages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bright Data SERP API failed: ${response.statusText}`);
      }

      const rawData = await response.json() as any;
      // Map to standard format
      return (rawData.organic_results || []).map((item: any, index: number) => ({
        rank: index + 1,
        title: item.title || "",
        snippet: item.description || "",
        url: item.link || "",
      }));
    } catch (error) {
      console.error("Bright Data SERP call error:", error);
      return [];
    }
  }

  // Scrape brand pages via Web Unlocker
  async scrapeMarkdown(url: string): Promise<string> {
    if (!this.apiToken) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return `# Welcome to ${url}
This is a mock scraped page representing the homepage of ${url}.
We offer a unified workspace for your entire business. 

## Key Features
- Dynamic visual pipelines to drag-and-drop deals
- Structured schemas for FAQ, Organization, and Product
- Comprehensive dashboard reporting for executive teams
- 24/7 support channels available for Enterprise clients

## Frequently Asked Questions
### What is the pricing?
Pricing starts at $25 per user/month, with free trials available for all plans.
### Does it offer API integrations?
Yes, we offer standard REST API access to sync your tools seamlessly.
`;
    }

    try {
      const response = await fetch("https://api.brightdata.com/scrape/markdown", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          group: "scrape_as_markdown",
        }),
      });

      if (!response.ok) {
        throw new Error(`Bright Data Web Unlocker failed: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.markdown || "";
    } catch (error) {
      console.error("Bright Data Web Unlocker error:", error);
      return "";
    }
  }

  // Batch scrape competitor pages
  async scrapeBatch(urls: string[]): Promise<ScrapeResponse[]> {
    if (!this.apiToken) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return urls.map((url) => ({
        url,
        content: `# Scraped content of ${url}
This is simulated content from Bright Data scrape_batch for ${url}.
The company provides software solutions with FAQ sections and schemas.
`
      }));
    }

    try {
      const response = await fetch("https://api.brightdata.com/scrape/batch", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls,
          group: "advanced_scraping",
        }),
      });

      if (!response.ok) {
        throw new Error(`Bright Data scrape_batch failed: ${response.statusText}`);
      }

      const data = await response.json() as any[];
      return data.map((item: any) => ({
        url: item.url,
        content: item.markdown || item.content || "",
      }));
    } catch (error) {
      console.error("Bright Data Scrape Batch error:", error);
      return urls.map(url => ({ url, content: "" }));
    }
  }

  // Extract structured details using Bright Data extraction
  async extract(urlOrContent: string, options: { prompt: string }): Promise<ExtractResponse> {
    if (!this.apiToken) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const company = urlOrContent.includes("http") 
        ? urlOrContent.replace(/https?:\/\/(www\.)?/, "").split(".")[0]
        : "brand";
      const companyCapitalized = company.charAt(0).toUpperCase() + company.slice(1);

      return {
        companyName: companyCapitalized,
        productCategory: "SaaS CRM Software",
        keyFeatures: ["Visual Deals Board", "Contact Timeline", "Email Auto-Sync", "Custom Reporting"],
        schemaTypes: ["Organization", "FAQPage", "WebPage"],
        faqPresent: true,
        valueProp: `The ultimate CRM and pipeline tracker for teams looking to grow sales and customer satisfaction.`,
        entityScore: 75,
        faqCount: 4,
        blufScore: 8,
        headingDepth: 3,
        thirdPartyMentions: 12,
      };
    }

    try {
      const response = await fetch("https://api.brightdata.com/scrape/extract", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: urlOrContent,
          prompt: options.prompt,
          group: "advanced_scraping",
        }),
      });

      if (!response.ok) {
        throw new Error(`Bright Data Extraction failed: ${response.statusText}`);
      }

      return await response.json() as ExtractResponse;
    } catch (error) {
      console.error("Bright Data Extraction error:", error);
      // Fallback
      return {
        companyName: "Brand",
        productCategory: "SaaS Utility",
        keyFeatures: [],
        schemaTypes: [],
        faqPresent: false,
        valueProp: "",
        entityScore: 50,
        faqCount: 0,
        blufScore: 5,
        headingDepth: 2,
        thirdPartyMentions: 0,
      };
    }
  }

  private detectBrandNameFromQuery(query: string): string {
    if (query.toLowerCase().includes("salesforce")) return "Salesforce";
    if (query.toLowerCase().includes("hubspot")) return "HubSpot";
    if (query.toLowerCase().includes("notion")) return "Notion";
    return "AEOspy";
  }
}

export const brightDataClient = new BrightDataClient();
