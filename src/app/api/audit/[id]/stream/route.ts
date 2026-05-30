import { NextRequest } from "next/server";
import { AuditOrchestrator } from "@/lib/agents/orchestrator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const domain = searchParams.get("domain") || "";
  const keywordsStr = searchParams.get("keywords") || "[]";
  const geoMode = searchParams.get("geoMode") === "true";
  const demoMode = searchParams.get("demoMode") === "true";

  let keywords: string[] = [];
  try {
    keywords = JSON.parse(keywordsStr);
  } catch (e) {
    keywords = [];
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: any) => {
    try {
      writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (e) {
      console.error("SSE stream write error:", e);
    }
  };

  // Run the audit in the background
  (async () => {
    try {
      const orchestrator = new AuditOrchestrator(
        domain,
        keywords,
        geoMode,
        demoMode,
        (event) => {
          sendEvent(event);
        },
        id
      );

      await orchestrator.run();
    } catch (error: any) {
      sendEvent({ type: "error", message: error.message });
    } finally {
      try {
        await writer.close();
      } catch (e) {
        // already closed
      }
    }
  })();

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
