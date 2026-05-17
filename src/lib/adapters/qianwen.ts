import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "qianwen",
  name: "千文",
  description: "适用于千文 (通义千问) 的中文生图提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);
    const lines: string[] = [];
    lines.push("【生成任务】创建一套漫画分镜图片");
    lines.push(`风格：${comic_info.style}`);
    lines.push(`配色：${comic_info.color_scheme}`);
    lines.push(`角色：${comic_info.character?.name || "主角"} - ${comic_info.character?.appearance || ""}`);
    lines.push("");
    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`--- 第${i + 1}格 ---`);
      lines.push(panel.image_prompt || panel.scene);
      if (panel.text) lines.push(`文案：${panel.text}`);
      lines.push("");
    });
    return lines.join("\n");
  },
});
