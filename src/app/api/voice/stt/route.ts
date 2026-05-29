import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    status: "success", 
    message: "Speechmatics STT route. Real-time microphone capture runs on the client via Web Speech API (webkitSpeechRecognition) for latency-free, keyless local operation." 
  });
}
