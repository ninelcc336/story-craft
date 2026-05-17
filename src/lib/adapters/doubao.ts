import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "doubao",
  name: "豆包 / 即梦",
  description: "适用于字节豆包/即梦 AI 的中文提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);

    const lines: string[] = [];
    lines.push(`生成一套${comic_info.type}系列漫画，详细设定如下：`);
    lines.push("");
    lines.push(`画面风格：${comic_info.style}`);
    lines.push(`色彩方案：${comic_info.color_scheme}`);
    lines.push(
      `角色设定：${comic_info.character?.name || "主角"}，外貌：${comic_info.character?.appearance || ""}，性格：${comic_info.character?.personality || ""}`
    );
    lines.push(`场景风格：${comic_info.background_style}`);
    lines.push("");

    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      const imagePrompt = panel.image_prompt || `${panel.scene}。${panel.action}。`;
      lines.push(`【第${i + 1}格 - ${panel.description}】`);
      lines.push(`生成图片：${imagePrompt}`);
      lines.push(`补充细节：${panel.details}`);
      lines.push(`表情要求：${panel.expression}`);
      if (panel.text) {
        lines.push(`画面文案：${panel.text}`);
      }
      lines.push("");
    });

    lines.push("重要提示：以上所有分镜中，角色外貌必须保持完全一致！请使用相同的角色形象。");

    return lines.join("\n");
  },
});
