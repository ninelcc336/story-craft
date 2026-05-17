import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "wanxiang",
  name: "万相",
  description: "适用于阿里万相的中文生图提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);
    const lines: string[] = [];
    lines.push(`万相生图 - ${comic_info.type}系列`);
    lines.push(`整体风格：${comic_info.style}`);
    lines.push(`色彩方案：${comic_info.color_scheme}`);
    lines.push(`角色：${comic_info.character?.name || "主角"}，外貌：${comic_info.character?.appearance || ""}，性格：${comic_info.character?.personality || ""}`);
    lines.push("");
    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`【分镜${i + 1}】`);
      lines.push(panel.image_prompt || panel.scene);
      if (panel.text) lines.push(`文本：${panel.text}`);
      lines.push("");
    });
    lines.push("要求：所有分镜中角色外貌保持一致。");
    return lines.join("\n");
  },
});
