import type { AIProvider } from "./providers/types";
import { ClaudeProvider } from "./providers/claude";

export type { AIProvider };

export function createAIClient(): AIProvider {
  const provider = process.env.AI_PROVIDER || "claude";

  switch (provider) {
    case "claude":
    default:
      return new ClaudeProvider();
  }
}
