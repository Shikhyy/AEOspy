import { NextResponse } from "next/server";
import { db } from "../../../lib/db/client";
import { audits } from "../../../lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db
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

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
