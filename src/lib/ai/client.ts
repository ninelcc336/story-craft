import type { AIProvider } from "./providers/types";
import { ClaudeProvider } from "./providers/claude";

export type { AIProvider };

function getServerApiKey(): string {
  return process.env.ANTHROPIC_API_KEY || "";
}

export function createAIClient(
  apiKey?: string,
  model?: string,
  baseUrl?: string
): AIProvider {
  const key = apiKey || getServerApiKey();
  return new ClaudeProvider(key, model, baseUrl);
}
