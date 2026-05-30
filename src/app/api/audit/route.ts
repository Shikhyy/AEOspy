import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { audits } from "@/lib/db/schema";
import { seedDemoCacheIfNeeded } from "@/lib/cache/demo-cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, keywords, geoMode = false, demoMode = false } = body;

    if (!domain) {
      return NextResponse.json({ error: "Domain URL is required" }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    
    let auditId = `audit-${Math.random().toString(36).substring(2, 11)}`;
    if (demoMode) {
      const demoSlug = Object.keys(demoBrandsCache).find(k => domain.includes(k));
      if (demoSlug) auditId = `demo-${demoSlug}-id`;
    }

    try {
      await db.insert(audits).values({
        id: auditId,
        domain: cleanDomain,
        brandName: cleanDomain.split(".")[0].toUpperCase(),
        brandLogoUrl: `https://logo.clearbit.com/${cleanDomain}` || `https://${cleanDomain}/favicon.ico`,
        keywords: JSON.stringify(keywords || []),
        status: "pending",
        createdAt: Math.floor(Date.now() / 1000),
        geoMode: geoMode ? 1 : 0,
        demoMode: demoMode ? 1 : 0,
      });
    } catch (e) {
      console.warn("DB insert failed (likely no DB configured). Proceeding in-memory.");
    }

    const streamUrl = `/api/audit/${auditId}/stream?domain=${encodeURIComponent(cleanDomain)}&keywords=${encodeURIComponent(JSON.stringify(keywords || []))}&geoMode=${geoMode}&demoMode=${demoMode}`;

    return NextResponse.json({
      auditId,
      status: "pending",
      streamUrl,
    });
  } catch (error: any) {
    console.error("POST /api/audit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
