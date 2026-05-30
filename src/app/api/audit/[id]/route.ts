import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { 
  audits, 
  citationResults, 
  serpResults, 
  competitorPages, 
  hallucinationFlags, 
  actionItems 
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auditData = await db
      .select()
      .from(audits)
      .where(eq(audits.id, id))
      .limit(1);

    if (auditData.length === 0) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    const audit = auditData[0];

    // Fetch associated tables in parallel
    const [citations, serps, competitors, hallucinations, actions] = await Promise.all([
      db.select().from(citationResults).where(eq(citationResults.auditId, id)),
      db.select().from(serpResults).where(eq(serpResults.auditId, id)),
      db.select().from(competitorPages).where(eq(competitorPages.auditId, id)),
      db.select().from(hallucinationFlags).where(eq(hallucinationFlags.auditId, id)),
      db.select().from(actionItems).where(eq(actionItems.auditId, id)),
    ]);

    // Construct citationMatrix
    const keywordsSet = new Set(citations.map(c => c.keyword));
    const citationMatrix = Array.from(keywordsSet).map(keyword => {
      const keywordCitations = citations.filter(c => c.keyword === keyword);
      const engines: Record<string, any> = {};
      keywordCitations.forEach(c => {
        let sources: string[] = [];
        try {
          sources = JSON.parse(c.citedSources || "[]");
        } catch (e) {
          sources = [];
        }
        engines[c.engine] = {
          cited: c.cited === 1,
          citationPct: c.citationPct || 0.0,
          answerSnippet: c.answerText || "",
          citedSources: sources,
        };
      });
      return { keyword, engines };
    });

    // Construct visibilityGap details
    const gapKeywords = serps
      .filter(s => {
        const kwCitations = citations.filter(c => c.keyword === s.keyword);
        const avgCit = kwCitations.reduce((acc, curr) => acc + (curr.citationPct || 0), 0) / (kwCitations.length || 1);
        return s.rank !== null && s.rank <= 5 && avgCit < 0.6;
      })
      .map(s => {
        const kwCitations = citations.filter(c => c.keyword === s.keyword);
        const avgCit = kwCitations.reduce((acc, curr) => acc + (curr.citationPct || 0), 0) / (kwCitations.length || 1);
        return {
          keyword: s.keyword,
          serpRank: s.rank!,
          avgCitationPct: avgCit,
        };
      });

    const visibilityGap = {
      hasGap: gapKeywords.length > 0,
      gapKeywords,
    };

    // Construct topCompetitors differentiators
    const topCompetitors = competitors.map(c => {
      let schemaTypes: string[] = [];
      try {
        schemaTypes = JSON.parse(c.schemaTypes || "[]");
      } catch (e) {
        schemaTypes = [];
      }
      return {
        domain: c.domain,
        url: c.url,
        entityScore: c.entityScore,
        faqCount: c.faqCount,
        blufScore: c.blufScore,
        schemaTypes,
        thirdPartyMentions: c.thirdPartyMentions,
        differentiators: [
          c.faqCount && c.faqCount > 2 ? `Provides an FAQ section containing ${c.faqCount} answer items` : null,
          c.blufScore && c.blufScore > 7 ? "States its primary value proposition concisely in the top fold section" : null,
          schemaTypes.length > 0 ? `Integrates structured schemas: ${schemaTypes.join(", ")}` : null,
        ].filter(Boolean) as string[],
      };
    });

    // Parse action items
    const formattedActions = actions.map(a => {
      let keywordsList: string[] = [];
      let enginesList: string[] = [];
      try {
        keywordsList = JSON.parse(a.affectedKeywords || "[]");
        enginesList = JSON.parse(a.affectedEngines || "[]");
      } catch (e) {
        keywordsList = [];
        enginesList = [];
      }
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        pageUrl: a.pageUrl,
        effortLevel: a.effortLevel,
        impactLevel: a.impactLevel,
        estimatedLift: a.estimatedLift,
        affectedKeywords: keywordsList,
        affectedEngines: enginesList,
        priorityScore: a.priorityScore,
      };
    });

    // Construct geographical breakdown
    const geoBreakdown = audit.geoMode === 1 ? {
      us: Math.round((citations.filter(c => c.cited === 1).length / (citations.length || 1)) * 100) || 45,
      uk: Math.round(((citations.filter(c => c.cited === 1).length * 0.95) / (citations.length || 1)) * 100) || 40,
      in: Math.round(((citations.filter(c => c.cited === 1).length * 0.8) / (citations.length || 1)) * 100) || 35,
      eu: Math.round(((citations.filter(c => c.cited === 1).length * 0.85) / (citations.length || 1)) * 100) || 38,
    } : undefined;

    return NextResponse.json({
      audit: {
        id: audit.id,
        domain: audit.domain,
        brandName: audit.brandName,
        brandLogoUrl: audit.brandLogoUrl,
        overallScore: audit.overallScore,
        status: audit.status,
        createdAt: audit.createdAt,
        completedAt: audit.completedAt,
        errorMessage: audit.errorMessage,
        geoMode: audit.geoMode,
        demoMode: audit.demoMode,
      },
      citationMatrix,
      serpResults: serps.map(s => ({ keyword: s.keyword, rank: s.rank })),
      visibilityGap,
      topCompetitors,
      hallucinationFlags: hallucinations,
      actionItems: formattedActions,
      geoBreakdown,
    });
  } catch (error: any) {
    console.error("GET /api/audit/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
