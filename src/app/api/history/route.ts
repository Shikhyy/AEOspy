import { NextResponse } from "next/server";
import { db } from "../../../lib/db/client";
import { audits } from "../../../lib/db/schema";
import { desc } from "drizzle-orm";

import { demoBrandsCache } from "../../../lib/cache/demo-cache";

export async function GET() {
  try {
    let history: any[] = [];
    try {
      history = await db
        .select({
          id: audits.id,
          domain: audits.domain,
          brandName: audits.brandName,
          overallScore: audits.overallScore,
          status: audits.status,
          createdAt: audits.createdAt,
        })
        .from(audits)
        .orderBy(desc(audits.createdAt));
    } catch (e) {
      console.warn("DB history fetch failed, falling back to demo cache", e);
      history = Object.values(demoBrandsCache).map(d => ({
        id: d.audit.id,
        domain: d.audit.domain,
        brandName: d.audit.brandName,
        overallScore: d.audit.overallScore,
        status: d.audit.status,
        createdAt: d.audit.createdAt,
      }));
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
