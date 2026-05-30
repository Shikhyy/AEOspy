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

  // Transcribe audio to text (STT)
  async transcribe(audioBuffer: Buffer, fileName: string = "audio.wav"): Promise<string> {
    if (!this.apiKey) {
      console.log("[Speechmatics Mock] Transcribing audio buffer...");
      return "Hubspot.com"; // Mock STT return value
    }

    try {
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      formData.append('data_file', blob, fileName);
      formData.append('config', JSON.stringify({
        type: 'transcription',
        transcription_config: { language: 'en' }
      }));

      const response = await fetch("https://asr.api.speechmatics.com/v2/jobs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Speechmatics STT request failed: ${response.statusText}`);
      }

      const jobData = await response.json();
      return jobData.id || "job_started"; // In a real app, this would poll for completion
    } catch (error) {
      console.error("Speechmatics STT error:", error);
      throw error;
    }
  }
}

export const speechmaticsClient = new SpeechmaticsClient();
