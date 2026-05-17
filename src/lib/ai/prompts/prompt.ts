import type { StoryboardScript } from "@/types/storyboard";
import * as yaml from "js-yaml";

export function buildPromptForPanels(storyboard: StoryboardScript): string {
  const yamlStr = yaml.dump(storyboard, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });

  return `请以一名专业的 AI 生图提示词工程师的身份，为以下分镜脚本的每个面板生成完整的生图提示词。

【分镜脚本】
\`\`\`yaml
${yamlStr}
\`\`\`

【任务】
为每个 panel 添加以下 3 个字段：

1. **image_prompt**：正向提示词（中文），融合以下信息为一段流畅的生图提示词：
   - comic_info 中的 style、color_scheme、background_style
   - comic_info 中的 character（name、appearance、personality）
   - 该 panel 的 scene、action、expression、details
   - 建议画幅比例（如 3:4 竖幅适合小红书，16:9 横幅适合公众号封面）

2. **negative_prompt**：负面提示词，列出不希望出现在画面中的元素：
   - 一般画质问题（模糊、变形、多余的手指、文字乱码等）
   - 与当前风格冲突的元素（如手绘风格应排除照片级真实渲染）
   - 角色一致性相关（如不同外貌特征的角色）

3. **tech_params**：建议的技术参数：
   - 推荐分辨率（如 1024x1536 for 3:4）
   - 采样器建议（如 DPM++ 2M Karras）
   - 步数建议（如 20-30 steps）
   - CFG scale 建议（如 7-9）

【输出格式】在原 YAML 基础上扩展：
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
    image_prompt: "手绘简笔画风格，暖黄主色调，一个细长圆柱身体、红色火柴头的角色在温暖的手绘街道上行走..."
    negative_prompt: "照片级真实渲染，3D渲染，复杂背景，多余手指，文字乱码，水印，签名..."
    tech_params:
      resolution: "1024x1536"
      sampler: "DPM++ 2M Karras"
      steps: 25
      cfg_scale: 7.5
  ...
\`\`\`

【重要规则】
1. image_prompt 要可以直接复制粘贴到生图工具使用
2. 每个面板的 image_prompt、negative_prompt、tech_params 都要独立生成，不可重复
3. 只输出完整的 YAML 代码块，不要有任何额外文字`;
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
