import { createAIClient } from "@/lib/ai/client";
import {
  buildStoryboardPrompt,
  parseStoryboardResponse,
  buildRestylePrompt,
} from "@/lib/ai/prompts/storyboard";
import type { Character } from "@/types/character";
import type { StoryboardScript } from "@/types/storyboard";
import type { WritingStyle } from "@/types/story";
import * as yaml from "js-yaml";

export async function generateStoryboard(
  params: {
    story: string;
    character: Character;
    panelCount: number;
  },
  apiKey?: string,
  model?: string
): Promise<StoryboardScript> {
  const client = createAIClient(apiKey, model);
  const prompt = buildStoryboardPrompt(params);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 4000,
        temperature: 0.7,
      });
      return parseStoryboardResponse(response, params.character);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("分镜生成失败");
}

export async function restyleStoryboard(
  params: {
    panels: Record<string, { text: string }>;
    writingStyle: WritingStyle;
  },
  apiKey?: string,
  model?: string
): Promise<Record<string, { text: string }>> {
  const client = createAIClient(apiKey, model);
  const prompt = buildRestylePrompt(params);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 2000,
        temperature: 0.8,
      });
      const yamlMatch = response.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/);
      const yamlStr = yamlMatch ? yamlMatch[1].trim() : response.trim();
      const parsed = yaml.load(yamlStr) as Record<
        string,
        Record<string, { text: string }>
      >;
      if (parsed && parsed.panels) {
        return parsed.panels as Record<string, { text: string }>;
      }
      throw new Error("风格切换 YAML 解析失败");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError || new Error("风格切换失败");
}
