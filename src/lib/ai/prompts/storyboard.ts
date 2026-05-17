import type { Character } from "@/types/character";
import type { StoryboardScript } from "@/types/storyboard";
import * as yaml from "js-yaml";

export function buildStoryboardPrompt(params: {
  story: string;
  character: Character;
  panelCount: number;
}): string {
  const { story, character, panelCount } = params;

  const characterSection =
    character.name && (character.appearance || character.personality)
      ? `【角色设定】（必须在所有分镜中保持一致）
- 角色名称：${character.name}
- 外貌特征：${character.appearance || "待定"}
- 性格特点：${character.personality || "待定"}`
      : `【角色设定】请根据故事内容自动推断主角的外貌和性格特征，并在 comic_info.character 中详细描述。`;

  return `请将以下故事拆解为${panelCount}格分镜脚本（漫画/图文），并严格使用 YAML 格式输出。

${characterSection}

【故事全文】
${story}

【输出要求】
请严格按照以下 YAML 结构输出，不要有任何额外的解释文字：

\`\`\`yaml
comic_info:
  type: "四格漫画"
  style: "请根据故事氛围选择视觉风格，如：手绘简笔画、日系治愈插画、扁平矢量漫画、水墨风、3D卡通等"
  color_scheme: "请根据故事氛围指定配色方案，如：暖黄主色调、冷蓝暗调、柔和粉彩、高对比度黑白等"
  character:
    name: "${character.name || "主角"}"
    appearance: "${character.appearance || "请具体描述角色的身高、体型、发型、五官、服装等"}"
    personality: "${character.personality || "请描述角色的性格特点"}"
  background_style: "请描述背景场景的视觉风格，如：白色简约背景搭配手绘街景、温暖室内场景等"
panels:
  panel1:
    description: "第一格的作用说明"
    scene: "该格的场景描述（环境、背景、物品）"
    action: "角色的动作描述"
    expression: "角色的表情描述"
    details: "重要的视觉细节"
    text: "该格的文案/对话"
  panel2:
    description: "第二格的作用说明"
    scene: "..."
    action: "..."
    expression: "..."
    details: "..."
    text: "..."
  # ... 共${panelCount}格
\`\`\`

【重要规则】
1. 必须生成恰好 ${panelCount} 个分镜面板
2. 每个面板的 6 个字段（description/scene/action/expression/details/text）都必须非空
3. 角色的外貌和性格在所有面板中必须保持一致
4. 分镜之间要有清晰的叙事节奏：铺垫→发展→高潮→结局
5. 输出只包含 YAML 代码块，不要有任何额外文字`;
}

export function parseStoryboardResponse(
  raw: string,
  character: Character
): StoryboardScript {
  const yamlMatch = raw.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/);
  const yamlStr = yamlMatch ? yamlMatch[1].trim() : raw.trim();

  let parsed: unknown;
  try {
    parsed = yaml.load(yamlStr);
  } catch {
    throw new Error("AI 返回的内容无法解析为有效的 YAML 格式，请重试");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI 返回的 YAML 结构不正确，请重试");
  }

  const data = parsed as Record<string, unknown>;

  if (!data.comic_info || typeof data.comic_info !== "object") {
    throw new Error("分镜脚本缺少 comic_info 部分");
  }

  if (!data.panels || typeof data.panels !== "object") {
    throw new Error("分镜脚本缺少 panels 部分");
  }

  const panels = data.panels as Record<string, unknown>;
  const panelKeys = Object.keys(panels);

  if (panelKeys.length < 2) {
    throw new Error(`分镜数量不足（仅有 ${panelKeys.length} 个，至少需要 2 个）`);
  }

  const requiredFields = [
    "description",
    "scene",
    "action",
    "expression",
    "details",
    "text",
  ];

  for (const key of panelKeys) {
    const panel = panels[key];
    if (!panel || typeof panel !== "object") {
      throw new Error(`分镜 ${key} 数据结构不正确`);
    }
    for (const field of requiredFields) {
      const val = (panel as Record<string, unknown>)[field];
      if (!val || typeof val !== "string" || val.trim().length === 0) {
        throw new Error(`分镜 ${key} 缺少字段 "${field}"`);
      }
    }
  }

  const comicInfo = data.comic_info as Record<string, unknown>;
  if (character.name) {
    comicInfo.character = character;
  }

  return {
    comic_info: comicInfo as unknown as StoryboardScript["comic_info"],
    panels: panels as unknown as StoryboardScript["panels"],
  };
}

export function buildRestylePrompt(params: {
  panels: Record<string, { text: string }>;
  writingStyle: string;
}): string {
  const { panels, writingStyle } = params;

  const panelsText = Object.entries(panels)
    .map(([key, panel]) => `  ${key}:\n    text: "${panel.text}"`)
    .join("\n");

  return `请将以下分镜脚本中的 text（文案/对话）改为${writingStyle}风格。

【当前分镜文案】
${panelsText}

【风格要求】
- 口语化：日常对话语气，亲切自然，像朋友聊天
- 文学化：优美典雅，注重修辞和意境
- 网感化：使用网络流行语、emoji、短句，适合小红书/社交媒体
- 治愈系：温和柔软，安抚情绪，充满希望

【输出格式】请严格使用相同的 YAML 结构输出，仅修改 text 字段的值，保持其他字段不变：
\`\`\`yaml
${panelsText}
\`\`\`

只输出 YAML 代码块，不要有任何额外文字。`;
}
