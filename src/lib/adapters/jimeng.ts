import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "jimeng",
  name: "即梦",
  description: "适用于字节即梦 AI 的中文生图提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);
    const lines: string[] = [];
    lines.push(`即梦AI 生图提示`);
    lines.push(`类型：${comic_info.type}`);
    lines.push(`画风：${comic_info.style}`);
    lines.push(`配色：${comic_info.color_scheme}`);
    lines.push(`角色设定：${comic_info.character?.name || ""} - ${comic_info.character?.appearance || ""} - ${comic_info.character?.personality || ""}`);
    lines.push(`场景风格：${comic_info.background_style}`);
    lines.push("");
    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`【第${i + 1}格 - ${panel.description}】`);
      lines.push(`画面描述：${panel.image_prompt || panel.scene}`);
      if (panel.text) lines.push(`文字：${panel.text}`);
      lines.push("");
    });
    lines.push("重要：角色形象在所有画面中必须统一！");
    return lines.join("\n");
  },
});
