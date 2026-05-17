import { createAIClient } from "@/lib/ai/client";
import {
  buildStoryPrompt,
  parseStoryResponse,
  buildExpandPrompt,
} from "@/lib/ai/prompts/story";
import type { StoryStyle, Story } from "@/types/story";

export async function generateStory(
  params: {
    topic: string;
    style: StoryStyle;
    wordCount?: number;
  },
  apiKey?: string,
  model?: string
): Promise<Story> {
  const client = createAIClient(apiKey, model);
  const prompt = buildStoryPrompt(params);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 3000,
        temperature: 0.8,
      });
      return parseStoryResponse(response, params);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("故事生成失败");
}

export async function expandStory(
  params: {
    summary: string;
    style: StoryStyle;
    wordCount?: number;
  },
  apiKey?: string,
  model?: string
): Promise<Story> {
  const client = createAIClient(apiKey, model);
  const prompt = buildExpandPrompt(params);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.generateCompletion(prompt, {
        maxTokens: 3000,
        temperature: 0.8,
      });
      return parseStoryResponse(response, {
        topic: params.summary,
        style: params.style,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("故事扩展失败");
}
