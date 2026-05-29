export interface SpeechmaticsConfig {
  apiKey: string;
}

export class SpeechmaticsClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SPEECHMATICS_API_KEY || "";
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Synthesize text to speech
  async synthesize(text: string): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error("Speechmatics API Key not configured.");
    }

    try {
      const response = await fetch("https://tts.api.speechmatics.com/v1/synthesize", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: "en-US-neutral", // Standard English voice
          format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error(`Speechmatics TTS request failed: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error("Speechmatics TTS error:", error);
      throw error;
    }
  }
}

export const speechmaticsClient = new SpeechmaticsClient();
