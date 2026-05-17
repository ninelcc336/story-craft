import type { StoryboardScript } from "@/types/storyboard";
import * as yaml from "js-yaml";

export function buildPromptForPanels(storyboard: StoryboardScript): string {
  const yamlStr = yaml.dump(storyboard, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });

  return `请为以下分镜脚本的每个面板生成一个完整的 AI 生图提示词（image_prompt 字段）。

【分镜脚本】
\`\`\`yaml
${yamlStr}
\`\`\`

【任务】
为每个 panel 添加一个 image_prompt 字段，该字段需要将以下信息融合为一段流畅的提示词：
- comic_info 中的 style、color_scheme、background_style
- comic_info 中的 character（name、appearance、personality）
- 该 panel 的 scene、action、expression、details

每个 image_prompt 应该是可以直接复制粘贴到生图工具（如 Nano Banana、Gemini、DALL-E、豆包等）使用的完整中文描述。

【输出格式】请在原 YAML 结构的基础上，为每个 panel 添加 image_prompt 字段：
\`\`\`yaml
comic_info:
  ...
panels:
  panel1:
    description: "..."
    scene: "..."
    action: "..."
    expression: "..."
    details: "..."
    text: "..."
    image_prompt: "手绘简笔画风格，暖黄主色调，一个细长圆柱身体、红色火柴头的角色在温暖的手绘街道上行走，表情轻松微笑，背景有简单的路灯和小草..."
  ...
\`\`\`

只输出完整的 YAML 代码块，保留所有原有字段，不要有任何额外文字。`;
}

export function parsePromptResponse(
  raw: string,
  original: StoryboardScript
): StoryboardScript {
  const yamlMatch = raw.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/);
  const yamlStr = yamlMatch ? yamlMatch[1].trim() : raw.trim();

  let parsed: unknown;
  try {
    parsed = yaml.load(yamlStr);
  } catch {
    throw new Error("AI 返回的提示词 YAML 解析失败，请重试");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI 返回的提示词结构不正确，请重试");
  }

  const data = parsed as Record<string, unknown>;
  if (!data.panels || typeof data.panels !== "object") {
    throw new Error("提示词输出缺少 panels 部分");
  }

  const panels = data.panels as Record<string, unknown>;
  for (const [key, panel] of Object.entries(panels)) {
    if (!panel || typeof panel !== "object") continue;
    const p = panel as Record<string, unknown>;
    if (!p.image_prompt || typeof p.image_prompt !== "string") {
      throw new Error(`面板 ${key} 缺少 image_prompt 字段`);
    }
  }

  return {
    comic_info: (data.comic_info as StoryboardScript["comic_info"]) || original.comic_info,
    panels: panels as StoryboardScript["panels"],
  };
}
