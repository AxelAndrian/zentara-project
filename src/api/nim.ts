// NVIDIA NIM API integration for AI-powered threat analysis
export interface NIMConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface NIMRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface NIMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta?: {
      content?: string;
    };
    message?: {
      role: string;
      content: string;
    };
    finish_reason?: string;
  }>;
}

export class NIMClient {
  private config: NIMConfig;

  constructor(config: NIMConfig) {
    this.config = config;
  }

  async generateThreatAnalysis(
    countryName: string,
    threats: string[],
    capital: string,
    continent: string
  ): Promise<ReadableStream<Uint8Array>> {
    const prompt = `Analyze the cybersecurity threat landscape for ${countryName}:

Current Threats:
- ${threats.join("\n- ")}

Country Context:
- Capital: ${capital}
- Region: ${continent}

Provide:
1. Risk assessment summary
2. Top 3 immediate recommendations
3. Long-term security strategy`;

    const request: NIMRequest = {
      model: this.config.model,
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity expert providing threat analysis and recommendations for countries. Be specific, actionable, and professional in your responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await fetch(`/api/nim/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `NIM API error: ${response.status} ${response.statusText}`
      );
    }

    return response.body!;
  }

  async generateChatResponse(
    messages: Array<{ role: string; content: string }>
  ): Promise<ReadableStream<Uint8Array>> {
    const request: NIMRequest = {
      model: this.config.model,
      messages: messages as Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch(`/api/nim/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `NIM API error: ${response.status} ${response.statusText}`
      );
    }

    return response.body!;
  }
}

// Default configuration (you'll need to set your actual API key)
export const defaultNIMConfig: NIMConfig = {
  baseUrl: "/api/nim", // not used directly by the client anymore
  apiKey: "", // key is read server-side in the proxy route
  model: "meta/llama-3.1-8b-instruct",
};
