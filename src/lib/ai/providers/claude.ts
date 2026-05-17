import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./types";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-...") {
      throw new Error(
        "ANTHROPIC_API_KEY 未配置。请在 .env.local 中设置有效的 API Key。"
      );
    }
    this.client = new Anthropic({ apiKey });
  }

  async generateCompletion(
    prompt: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
      system:
        "你是一个专业的故事创作和分镜脚本生成助手。请严格按照用户要求的格式输出，使用中文。",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return text;
  }
}
