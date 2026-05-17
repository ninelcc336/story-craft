import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./types";

export class ClaudeProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string, baseUrl?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key || key === "sk-ant-..." || key.length < 10) {
      throw new Error(
        "API Key 未配置。请点击右上角齿轮图标配置 API Key。"
      );
    }
    const opts: Record<string, unknown> = { apiKey: key };
    if (baseUrl) opts.baseURL = baseUrl;
    this.client = new Anthropic(opts as unknown as { apiKey: string });
    this.model = model || "claude-sonnet-4-6";
  }

  async generateCompletion(
    prompt: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
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
