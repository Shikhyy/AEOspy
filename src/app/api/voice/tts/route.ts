import { NextRequest, NextResponse } from "next/server";
import { speechmaticsClient } from "@/lib/voice/speechmatics";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!speechmaticsClient.hasApiKey()) {
      return NextResponse.json({ 
        error: "Speechmatics API key not found", 
        mock: true, 
        text 
      });
    }

    const audioBuffer = await speechmaticsClient.synthesize(text);

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Speechmatics TTS API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
