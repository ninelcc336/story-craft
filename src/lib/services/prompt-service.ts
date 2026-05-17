import { createAIClient } from "@/lib/ai/client";
import {
  buildPromptForPanels,
  parsePromptResponse,
} from "@/lib/ai/prompts/prompt";
import type { StoryboardScript } from "@/types/storyboard";

export async function generatePromptImages(
  storyboard: StoryboardScript,
  apiKey?: string,
  model?: string
): Promise<StoryboardScript> {
  const client = createAIClient(apiKey, model);
  const prompt = buildPromptForPanels(storyboard);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 4000,
        temperature: 0.7,
      });
      return parsePromptResponse(response, storyboard);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("提示词生成失败");
}
