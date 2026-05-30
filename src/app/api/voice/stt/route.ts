import { NextRequest, NextResponse } from "next/server";
import { speechmaticsClient } from "@/lib/voice/speechmatics";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Process spoken content as part of live data pipelines
    const transcript = await speechmaticsClient.transcribe(buffer, audioFile.name);

    return NextResponse.json({ 
      status: "success", 
      transcript: transcript,
      message: "Speechmatics STT completed successfully." 
    });
  } catch (error) {
    console.error("STT Route Error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
