import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "keling",
  name: "可灵",
  description: "适用于快手可灵的中文生图提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);
    const lines: string[] = [];
    lines.push(`【可灵AI 漫画生成】`);
    lines.push(`类型：${comic_info.type}`);
    lines.push(`风格：${comic_info.style}`);
    lines.push(`色调：${comic_info.color_scheme}`);
    lines.push(`角色：${comic_info.character?.name || "主角"} | 外观：${comic_info.character?.appearance || ""} | 性格：${comic_info.character?.personality || ""}`);
    lines.push(`背景：${comic_info.background_style}`);
    lines.push("");
    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`分镜 ${i + 1}: ${panel.description}`);
      lines.push(`场景：${panel.scene}`);
      lines.push(`动作：${panel.action} | 表情：${panel.expression}`);
      if (panel.image_prompt) lines.push(`提示词：${panel.image_prompt}`);
      if (panel.text) lines.push(`文案：${panel.text}`);
      lines.push("");
    });
    return lines.join("\n");
  },
});
