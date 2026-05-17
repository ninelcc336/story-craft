import { createAIClient } from "@/lib/ai/client";
import {
  buildTrendsPrompt,
  parseTrendsResponse,
  buildAnglesPrompt,
  parseAnglesResponse,
} from "@/lib/ai/prompts/hotspot";
import type { HotTopic, StoryAngle, HotspotCategory } from "@/types/hotspot";

export async function fetchTrends(category?: HotspotCategory): Promise<HotTopic[]> {
  const client = createAIClient();
  const prompt = buildTrendsPrompt(category);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 3000,
        temperature: 0.8,
      });
      return parseTrendsResponse(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }
  throw lastError || new Error("热点获取失败");
}

export async function recommendAngles(topic: HotTopic): Promise<StoryAngle[]> {
  const client = createAIClient();
  const prompt = buildAnglesPrompt(topic);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 2000,
        temperature: 0.8,
      });
      return parseAnglesResponse(response);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError || new Error("角度推荐失败");
}
