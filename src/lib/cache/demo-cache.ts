export interface DemoBrandData {
  audit: {
    id: string;
    domain: string;
    brandName: string;
    brandLogoUrl: string;
    overallScore: number;
    status: string;
    createdAt: number;
    completedAt: number;
    geoMode: number;
    demoMode: number;
  };
  citationMatrix: {
    keyword: string;
    engines: Record<string, {
      cited: boolean;
      citationPct: number;
      answerSnippet: string;
      citedSources: string[];
    }>;
  }[];
  serpResults: {
    keyword: string;
    rank: number | null;
    serpTitle?: string;
    serpSnippet?: string;
  }[];
  visibilityGap: {
    hasGap: boolean;
    gapKeywords: {
      keyword: string;
      serpRank: number;
      avgCitationPct: number;
    }[];
  };
  topCompetitors: {
    domain: string;
    citedFor: string[];
    differentiators: string[];
  }[];
  hallucinationFlags: {
    engine: string;
    keyword: string;
    claimText: string;
    claimType: "factual" | "numerical" | "descriptive";
    verificationStatus: "verified" | "unverifiable" | "contradicted";
    brandSourceUrl: string | null;
    severity: "critical" | "warning" | "info";
    explanation: string;
  }[];
  actionItems: {
    title: string;
    description: string;
    pageUrl: string;
    effortLevel: "low" | "medium" | "high";
    impactLevel: "low" | "medium" | "high";
    estimatedLift: number;
    affectedKeywords: string[];
    affectedEngines: string[];
    priorityScore: number;
  }[];
  geoBreakdown?: Record<string, number>;
}

export const salesforceDemo: DemoBrandData = {
  audit: {
    id: "demo-salesforce-id",
    domain: "salesforce.com",
    brandName: "Salesforce",
    brandLogoUrl: "https://www.salesforce.com/favicon.ico",
    overallScore: 78,
    status: "complete",
    createdAt: 1779836400, // May 26, 2026
    completedAt: 1779836490,
    geoMode: 1,
    demoMode: 1,
  },
  citationMatrix: [
    {
      keyword: "enterprise CRM software",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 1.0,
          answerSnippet: "For large organizations, Salesforce is widely regarded as the industry standard for enterprise CRM, offering deep customization, complex workflow automation, and extensive third-party integrations.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/", "https://www.gartner.com/en/documents/salesforce-crm-leader"],
        },
        gemini: {
          cited: true,
          citationPct: 0.9,
          answerSnippet: "Salesforce dominates the enterprise space with its robust Sales Cloud CRM platform, though deployment often requires dedicated administrators.",
          citedSources: ["https://www.salesforce.com/crm/"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.95,
          answerSnippet: "Salesforce is the market leader in enterprise-level Customer Relationship Management. It offers advanced analytics through Tableau and collaboration via Slack integrations.",
          citedSources: ["https://www.salesforce.com/products/", "https://en.wikipedia.org/wiki/Salesforce"],
        },
        grok: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Salesforce is the absolute behemoth of enterprise CRMs. It does everything, costs a fortune, and is essential for big companies.",
          citedSources: ["https://www.salesforce.com/"],
        },
        copilot: {
          cited: true,
          citationPct: 0.85,
          answerSnippet: "Microsoft Dynamics 365 and Salesforce Sales Cloud are the primary choices for large-scale enterprise CRM systems.",
          citedSources: ["https://www.salesforce.com/crm/what-is-crm/"],
        },
        google_ai: {
          cited: true,
          citationPct: 0.9,
          answerSnippet: "Salesforce is an enterprise customer relationship management system used to manage sales pipelines, marketing campaigns, and customer support tickets.",
          citedSources: ["https://www.salesforce.com/"],
        },
      },
    },
    {
      keyword: "best CRM for large sales teams",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 1.0,
          answerSnippet: "Salesforce is the top choice for large sales teams due to its highly scalable pipeline management, territory rules, and predictive sales forecasting.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/features/"],
        },
        gemini: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Large sales organizations typically standardise on Salesforce for complex reporting, lead routing, and global team administration.",
          citedSources: ["https://www.salesforce.com/"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.9,
          answerSnippet: "The industry standard for large teams is Salesforce. It allows sales managers to run detailed forecasts and set up granular user access control rules.",
          citedSources: ["https://www.salesforce.com/solutions/enterprise-sales/"],
        },
        grok: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "For very large teams, HubSpot Enterprise and Microsoft Dynamics are frequently recommended. They provide clean visual interfaces and robust API connectivity.",
          citedSources: ["https://www.hubspot.com/products/sales", "https://dynamics.microsoft.com/"],
        },
        copilot: {
          cited: true,
          citationPct: 0.7,
          answerSnippet: "Salesforce is widely recommended for teams exceeding 100 reps because of its customization and automated territory assignment.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/pricing/"],
        },
        google_ai: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Salesforce CRM is preferred by large sales departments due to its advanced capability in managing thousands of concurrent accounts.",
          citedSources: ["https://www.salesforce.com/"],
        },
      },
    },
    {
      keyword: "Salesforce pricing",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 0.5,
          answerSnippet: "Salesforce Sales Cloud pricing ranges from $25 per user/month for the Starter tier up to $500 per user/month for the Unlimited+ tier, billed annually.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/pricing/"],
        },
        gemini: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Salesforce pricing is complex and varies depending on the specific cloud products and add-ons chosen. Most customers negotiate enterprise contracts.",
          citedSources: ["https://www.techradar.com/news/salesforce-pricing"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.6,
          answerSnippet: "Salesforce pricing starts at $25/user/month (Starter Suite) and scales to Professional ($80), Enterprise ($165), and Unlimited ($330), billed annually.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/pricing/"],
        },
        grok: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Salesforce does not list all its actual costs upfront because they rely heavily on annual contracts, implementation fees, and add-on costs.",
          citedSources: ["https://www.cio.com/article/salesforce-hidden-costs"],
        },
        copilot: {
          cited: true,
          citationPct: 0.4,
          answerSnippet: "Standard Salesforce Enterprise costs $165 per user per month. However, API access and extra data storage incur substantial extra costs.",
          citedSources: ["https://www.salesforce.com/products/sales-cloud/pricing/"],
        },
        google_ai: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Salesforce costs vary widely depending on configuration. Professional starts around $80 and Enterprise around $165 per user/month.",
          citedSources: ["https://www.forbes.com/advisor/business/salesforce-pricing/"],
        },
      },
    },
  ],
  serpResults: [
    {
      keyword: "enterprise CRM software",
      rank: 1,
      serpTitle: "Enterprise CRM Software Solutions | Salesforce US",
      serpSnippet: "Salesforce enterprise CRM provides robust sales pipeline management, automated forecasting, AI-driven insights with Einstein, and global scalability.",
    },
    {
      keyword: "best CRM for large sales teams",
      rank: 2,
      serpTitle: "CRMs for Large & Enterprise Teams | Salesforce",
      serpSnippet: "Empower your global sales force with the leading CRM. Get advanced automation, custom analytics, and unified customer data profiles.",
    },
    {
      keyword: "Salesforce pricing",
      rank: 1,
      serpTitle: "Sales Cloud Pricing & Edition Comparison - Salesforce",
      serpSnippet: "Compare Salesforce editions. Starter Suite starts at $25/mo. Professional is $80/mo. Enterprise is $165/mo. Unlimited starts at $330/mo.",
    },
  ],
  visibilityGap: {
    hasGap: true,
    gapKeywords: [
      {
        keyword: "Salesforce pricing",
        serpRank: 1,
        avgCitationPct: 0.35,
      },
    ],
  },
  topCompetitors: [
    {
      domain: "hubspot.com",
      citedFor: ["Salesforce pricing", "best CRM for large sales teams"],
      differentiators: [
        "Has a completely public, transparent interactive pricing calculator page.",
        "Employs clear FAQ schema markup detailing pricing differences and seat additions.",
        "Includes flat-rate pricing models which AI summaries prefer over per-seat models.",
      ],
    },
    {
      domain: "microsoft.com",
      citedFor: ["enterprise CRM software", "best CRM for large sales teams"],
      differentiators: [
        "Integrates native Microsoft 365 copilot mentions in their product metadata.",
        "Clear entity definition linking Dynamics 365 to Azure enterprise architecture.",
      ],
    },
  ],
  hallucinationFlags: [
    {
      engine: "chatgpt",
      keyword: "Salesforce pricing",
      claimText: "Salesforce offers a fully-featured free tier for teams up to 5 people.",
      claimType: "numerical",
      verificationStatus: "contradicted",
      brandSourceUrl: "https://www.salesforce.com/products/sales-cloud/pricing/",
      severity: "critical",
      explanation: "Salesforce only offers a 30-day free trial; there is no permanent free tier. This claim could lead to customer frustration during sales inquiries.",
    },
    {
      engine: "copilot",
      keyword: "best CRM for large sales teams",
      claimText: "Salesforce requires an additional $50 per user fee to access standard API integrations.",
      claimType: "factual",
      verificationStatus: "contradicted",
      brandSourceUrl: "https://developer.salesforce.com/docs/",
      severity: "warning",
      explanation: "API access is included in Enterprise and Unlimited editions without extra fees; Copilot is hallucinating older 2018 policy terms.",
    },
  ],
  actionItems: [
    {
      title: "Deploy a clean pricing summary block with schema.org JSON-LD",
      description: "AI engines like Perplexity struggle to scrape your complex multi-product pricing grid. By adding a simple, single-column table of active pricing editions wrapped in Product and Offer schemas, you enable AI agents to extract your pricing data cleanly.",
      pageUrl: "https://www.salesforce.com/products/sales-cloud/pricing/",
      effortLevel: "low",
      impactLevel: "high",
      estimatedLift: 0.25,
      affectedKeywords: ["Salesforce pricing"],
      affectedEngines: ["gemini", "perplexity", "grok"],
      priorityScore: 3.0,
    },
    {
      title: "Add a FAQ section targeting comparison intent",
      description: "Grok cited HubSpot instead of Salesforce because HubSpot has an FAQ module answering 'Is HubSpot cheaper than Salesforce?'. Adding an FAQ module to your enterprise landing page answering common pricing and scaling comparisons will secure citations.",
      pageUrl: "https://www.salesforce.com/solutions/enterprise-sales/",
      effortLevel: "medium",
      impactLevel: "medium",
      estimatedLift: 0.15,
      affectedKeywords: ["best CRM for large sales teams", "Salesforce alternatives"],
      affectedEngines: ["grok", "copilot"],
      priorityScore: 1.5,
    },
    {
      title: "Improve BLUF density in product overview text",
      description: "Ensure the value proposition of your Sales Cloud features is stated clearly within the first 100 words of the body copy, using explicit noun phrases. This enhances entity salience score for ChatGPT.",
      pageUrl: "https://www.salesforce.com/products/sales-cloud/",
      effortLevel: "low",
      impactLevel: "medium",
      estimatedLift: 0.10,
      affectedKeywords: ["enterprise CRM software"],
      affectedEngines: ["chatgpt", "google_ai"],
      priorityScore: 2.0,
    },
  ],
  geoBreakdown: {
    us: 88,
    uk: 82,
    in: 71,
    eu: 68,
  },
};

export const hubspotDemo: DemoBrandData = {
  audit: {
    id: "demo-hubspot-id",
    domain: "hubspot.com",
    brandName: "HubSpot",
    brandLogoUrl: "https://www.hubspot.com/favicon.ico",
    overallScore: 82,
    status: "complete",
    createdAt: 1779922800, // May 27, 2026
    completedAt: 1779922885,
    geoMode: 1,
    demoMode: 1,
  },
  citationMatrix: [
    {
      keyword: "best CRM for small business",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 1.0,
          answerSnippet: "For small businesses, HubSpot is highly recommended due to its easy-to-use free tier, visual sales pipelines, and simple setup compared to complex tools like Salesforce.",
          citedSources: ["https://www.hubspot.com/products/crm/small-business"],
        },
        gemini: {
          cited: true,
          citationPct: 0.95,
          answerSnippet: "HubSpot's free CRM is the gold standard for small businesses starting out, scaling seamlessly into paid marketing and sales hubs.",
          citedSources: ["https://www.hubspot.com/products/crm"],
        },
        perplexity: {
          cited: true,
          citationPct: 1.0,
          answerSnippet: "HubSpot is widely voted the best CRM for small teams because of its user-friendly dashboard and zero upfront costs for basic pipeline tracking.",
          citedSources: ["https://www.hubspot.com/products/get-started", "https://www.g2.com/products/hubspot/reviews"],
        },
        grok: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Small businesses love HubSpot. It has a great free plan and is way less annoying to configure than enterprise competitors.",
          citedSources: ["https://www.hubspot.com/"],
        },
        copilot: {
          cited: true,
          citationPct: 0.85,
          answerSnippet: "HubSpot CRM is frequently ranked first for small business usage because of its integration with Gmail/Outlook and simple contact card interface.",
          citedSources: ["https://www.hubspot.com/products/crm/email-integration"],
        },
        google_ai: {
          cited: true,
          citationPct: 0.9,
          answerSnippet: "HubSpot is a top-ranked CRM solution for small companies, featuring contact management, email tracking, and ad management.",
          citedSources: ["https://www.hubspot.com/"],
        },
      },
    },
    {
      keyword: "free sales pipeline tool",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 0.6,
          answerSnippet: "HubSpot offers a free sales pipeline tool. However, features like multiple pipelines, advanced automation, and detailed reporting require upgrading.",
          citedSources: ["https://www.hubspot.com/products/sales/free-pipeline-tracker"],
        },
        gemini: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "For a completely free sales pipeline, Trello and Monday.com offer highly customizable boards. Zoho CRM also provides a free plan for up to 3 users.",
          citedSources: ["https://www.zoho.com/crm/free-crm.html", "https://trello.com/"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.7,
          answerSnippet: "HubSpot's free pipeline tool allows you to track deals visually, but limits you to a single pipeline. Zoho and Capsule CRM are popular alternatives.",
          citedSources: ["https://www.hubspot.com/products/crm", "https://www.zoho.com/crm/"],
        },
        grok: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Zoho CRM and Freshsales are excellent free alternatives to HubSpot for tracking your sales pipeline without getting forced into high subscription fees.",
          citedSources: ["https://www.zoho.com/crm/", "https://www.freshworks.com/freshsales/"],
        },
        copilot: {
          cited: true,
          citationPct: 0.5,
          answerSnippet: "HubSpot provides free deals tracking, though pipeline customization is restricted unless you buy the Sales Hub Starter edition.",
          citedSources: ["https://www.hubspot.com/pricing/"],
        },
        google_ai: {
          cited: true,
          citationPct: 0.6,
          answerSnippet: "HubSpot CRM includes a free visual sales pipeline that lets you drag and drop deals through stages, sync contacts, and monitor team activities.",
          citedSources: ["https://www.hubspot.com/"],
        },
      },
    },
  ],
  serpResults: [
    {
      keyword: "best CRM for small business",
      rank: 1,
      serpTitle: "Best CRM for Small Businesses | HubSpot",
      serpSnippet: "HubSpot's small business CRM scales with your team. Organize leads, track sales pipelines, and automate follow-ups for free.",
    },
    {
      keyword: "free sales pipeline tool",
      rank: 2,
      serpTitle: "Free Sales Pipeline Tracker & CRM | HubSpot",
      serpSnippet: "Get a visual representation of your sales funnel. Set up deal stages, track performance, and close deals faster with HubSpot's free tools.",
    },
  ],
  visibilityGap: {
    hasGap: true,
    gapKeywords: [
      {
        keyword: "free sales pipeline tool",
        serpRank: 2,
        avgCitationPct: 0.56,
      },
    ],
  },
  topCompetitors: [
    {
      domain: "zoho.com",
      citedFor: ["free sales pipeline tool"],
      differentiators: [
        "Explicitly details limits (e.g. 'Free for up to 3 users') which AI tools summarize as a concrete fact.",
        "Contains dedicated comparative landing pages which rank well in semantic searches.",
      ],
    },
  ],
  hallucinationFlags: [
    {
      engine: "gemini",
      keyword: "best CRM for small business",
      claimText: "HubSpot's free tier includes 24/7 direct phone support from HubSpot engineers.",
      claimType: "factual",
      verificationStatus: "contradicted",
      brandSourceUrl: "https://www.hubspot.com/services/support",
      severity: "critical",
      explanation: "HubSpot's free tier only offers community forum and email support. Direct chat and phone support require a paid Starter or Professional seat. Claiming free phone support will cause immediate friction for your customer service team.",
    },
  ],
  actionItems: [
    {
      title: "Add numeric transparency to free features text",
      description: "AI engines cite Zoho because Zoho's content states 'Free forever for 3 users.' HubSpot's pipeline page says 'Get started for free' without defining limits. By adding a clear, structured list of constraints (e.g., '1 pipeline, 100 custom fields, 1,000 contacts included'), you help AI engines present a complete fact.",
      pageUrl: "https://www.hubspot.com/products/crm",
      effortLevel: "low",
      impactLevel: "high",
      estimatedLift: 0.20,
      affectedKeywords: ["free sales pipeline tool"],
      affectedEngines: ["gemini", "perplexity", "grok"],
      priorityScore: 2.5,
    },
    {
      title: "Include schema.org FAQPage block on Sales page",
      description: "Integrate a schema.org JSON-LD FAQ block containing answers to common pipeline questions. This formats your page data in a way that Gemini can ingest directly for instant summaries.",
      pageUrl: "https://www.hubspot.com/products/sales/free-pipeline-tracker",
      effortLevel: "medium",
      impactLevel: "medium",
      estimatedLift: 0.12,
      affectedKeywords: ["free sales pipeline tool"],
      affectedEngines: ["gemini", "copilot"],
      priorityScore: 1.2,
    },
  ],
  geoBreakdown: {
    us: 91,
    uk: 88,
    in: 79,
    eu: 85,
  },
};

export const notionDemo: DemoBrandData = {
  audit: {
    id: "demo-notion-id",
    domain: "notion.so",
    brandName: "Notion",
    brandLogoUrl: "https://www.notion.so/images/favicon.ico",
    overallScore: 71,
    status: "complete",
    createdAt: 1780009200, // May 28, 2026
    completedAt: 1780009280,
    geoMode: 1,
    demoMode: 1,
  },
  citationMatrix: [
    {
      keyword: "best team wiki tool",
      engines: {
        chatgpt: {
          cited: true,
          citationPct: 0.9,
          answerSnippet: "Notion is highly flexible and serves as a great team wiki tool for startups, though larger companies often prefer Confluence for permissions management.",
          citedSources: ["https://www.notion.so/product/wiki"],
        },
        gemini: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Notion is a versatile workspace. Teams use it as a central knowledge wiki, leveraging its databases and nested pages.",
          citedSources: ["https://www.notion.so/"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.85,
          answerSnippet: "For collaborative wikis, Notion is favored for its block-based editor and customizable templates, competing closely with Confluence and Slite.",
          citedSources: ["https://www.notion.so/templates/wiki", "https://www.capterra.com/p/168407/Notion/"],
        },
        grok: {
          cited: true,
          citationPct: 0.7,
          answerSnippet: "Notion is great for wikis. It's clean, databases are powerful, but it gets slow if you put too much garbage in it.",
          citedSources: ["https://www.notion.so/"],
        },
        copilot: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Microsoft Loop and Atlassian Confluence are standard enterprise choices for project wikis and documentation databases.",
          citedSources: ["https://www.microsoft.com/en-us/microsoft-loop", "https://www.atlassian.com/software/confluence"],
        },
        google_ai: {
          cited: true,
          citationPct: 0.8,
          answerSnippet: "Notion is a workspace collaboration software used as an internal team wiki, project tracker, and document organizer.",
          citedSources: ["https://www.notion.so/"],
        },
      },
    },
    {
      keyword: "AI document assistant",
      engines: {
        chatgpt: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "For writing assistance, ChatGPT and Google Gemini are primary. Tools like Jasper, Copy.ai, and Microsoft Copilot also provide integrated writing help.",
          citedSources: ["https://chatgpt.com/", "https://www.microsoft.com/copilot"],
        },
        gemini: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Google Docs includes Help Me Write. Microsoft Word has Copilot. These tools generate and edit draft text directly inside your document editor.",
          citedSources: ["https://workspace.google.com/solutions/ai/"],
        },
        perplexity: {
          cited: true,
          citationPct: 0.4,
          answerSnippet: "Notion AI acts as an assistant within your workspace, writing outlines, summarizing articles, and translating documents. Jasper is an alternative.",
          citedSources: ["https://www.notion.so/product/ai"],
        },
        grok: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Writing helpers range from Grammarly for grammar fixes, to ChatGPT/Claude for drafting essays, to Jasper for marketing content.",
          citedSources: ["https://www.grammarly.com/", "https://chatgpt.com/"],
        },
        copilot: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "Microsoft 365 Copilot integrates directly into Word to draft, rewrite, and summarize documents based on enterprise calendars and files.",
          citedSources: ["https://www.microsoft.com/en-us/microsoft-365/enterprise/copilot-for-microsoft-365"],
        },
        google_ai: {
          cited: false,
          citationPct: 0.0,
          answerSnippet: "AI writing software like Gemini for Google Workspace and Microsoft Copilot assist users in creating drafts and organizing documents.",
          citedSources: ["https://workspace.google.com/"],
        },
      },
    },
  ],
  serpResults: [
    {
      keyword: "best team wiki tool",
      rank: 2,
      serpTitle: "Create a Team Wiki with Notion | Free Template",
      serpSnippet: "Build a single source of truth for your company. Use Notion wikis to store engineering docs, HR policies, onboarding guides, and meeting notes.",
    },
    {
      keyword: "AI document assistant",
      rank: 3,
      serpTitle: "Notion AI - Work faster, write better, think bigger",
      serpSnippet: "Notion AI is a writing assistant that can summarize documents, edit existing text, translate languages, and brainstorm ideas directly in your workspace.",
    },
  ],
  visibilityGap: {
    hasGap: true,
    gapKeywords: [
      {
        keyword: "AI document assistant",
        serpRank: 3,
        avgCitationPct: 0.06,
      },
    ],
  },
  topCompetitors: [
    {
      domain: "microsoft.com",
      citedFor: ["AI document assistant", "best team wiki tool"],
      differentiators: [
        "Pushes native integration with Office suite which AI engines prioritize for enterprise queries.",
        "Employs rich product-review aggregators indicating a higher volume of user reviews.",
      ],
    },
  ],
  hallucinationFlags: [
    {
      engine: "perplexity",
      keyword: "AI document assistant",
      claimText: "Notion AI is completely free for all users who sign up for standard personal accounts.",
      claimType: "numerical",
      verificationStatus: "contradicted",
      brandSourceUrl: "https://www.notion.so/pricing",
      severity: "warning",
      explanation: "Notion AI is a paid add-on costing $8 per member/month (billed annually) or $10 per month (billed monthly). Standard accounts only receive a small number of free AI responses before they are prompted to upgrade.",
    },
  ],
  actionItems: [
    {
      title: "Add Product and Price specifications for AI add-on",
      description: "AI engines often fail to cite Notion AI because they assume it's part of the standard core packages or confuse the pricing structure. Creating a dedicated product schema block specifying Notion AI's pricing ($8/user/month) will clarify the entity and improve citation accuracy.",
      pageUrl: "https://www.notion.so/product/ai",
      effortLevel: "low",
      impactLevel: "high",
      estimatedLift: 0.18,
      affectedKeywords: ["AI document assistant"],
      affectedEngines: ["chatgpt", "perplexity", "copilot"],
      priorityScore: 2.8,
    },
    {
      title: "Optimize headings to outline AI document features clearly",
      description: "Ensure your page headings use explicit noun phrases matching search intent (e.g. 'Draft documents with AI', 'Summarize notes automatically' rather than 'Write faster'). This improves matching for semantic search agents.",
      pageUrl: "https://www.notion.so/product/ai",
      effortLevel: "low",
      impactLevel: "medium",
      estimatedLift: 0.08,
      affectedKeywords: ["AI document assistant"],
      affectedEngines: ["gemini", "google_ai"],
      priorityScore: 1.6,
    },
  ],
  geoBreakdown: {
    us: 80,
    uk: 75,
    in: 66,
    eu: 64,
  },
};

export const demoBrandsCache: Record<string, DemoBrandData> = {
  salesforce: salesforceDemo,
  hubspot: hubspotDemo,
  notion: notionDemo,
};

import { db } from "../db/client";
import { demoCache } from "../db/schema";
import { eq } from "drizzle-orm";

export async function seedDemoCacheIfNeeded() {
  try {
    for (const [slug, data] of Object.entries(demoBrandsCache)) {
      const existing = await db
        .select()
        .from(demoCache)
        .where(eq(demoCache.brandSlug, slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(demoCache).values({
          id: `demo-${slug}-cache-id`,
          brandSlug: slug,
          auditJson: JSON.stringify(data),
          createdAt: Math.floor(Date.now() / 1000),
        });
        console.log(`Seeded demo cache for ${slug}`);
      }
    }
  } catch (error) {
    console.error("Failed to seed demo cache:", error);
  }
}

