export interface CogneeConfig {
  apiKey: string;
  endpoint: string;
}

export class CogneeMemoryClient {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.COGNEE_API_KEY || "";
    this.endpoint = process.env.COGNEE_ENDPOINT || "https://api.cognee.ai";
  }

  hasMemoryAccess(): boolean {
    return !!this.apiKey;
  }

  // Add contextual memory for an entity (e.g., brand or competitor)
  async addMemory(entityId: string, context: Record<string, any>): Promise<void> {
    if (!this.apiKey) {
      console.log(`[Cognee Mock] Added memory for ${entityId}`);
      return;
    }
    
    try {
      await fetch(`${this.endpoint}/v1/memory`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entity_id: entityId, context }),
      });
    } catch (e) {
      console.error("Cognee memory insert failed:", e);
    }
  }

  // Retrieve contextual memory for an entity
  async getMemory(entityId: string): Promise<any> {
    if (!this.apiKey) {
      return null;
    }
    try {
      const res = await fetch(`${this.endpoint}/v1/memory/${entityId}`, {
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Cognee memory retrieval failed:", e);
    }
    return null;
  }
}

export const cognee = new CogneeMemoryClient();
