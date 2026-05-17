import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "nanobanana",
  name: "Nano Banana",
  description: "Nano Banana Pro 可用的结构化文本格式",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);

    const lines: string[] = [];
    lines.push("【漫画设定】");
    lines.push(`类型：${comic_info.type}`);
    lines.push(`风格：${comic_info.style}`);
    lines.push(`配色：${comic_info.color_scheme}`);
    lines.push(
      `角色：${comic_info.character?.name || "主角"} - ${comic_info.character?.appearance || ""} - ${comic_info.character?.personality || ""}`
    );
    lines.push(`背景：${comic_info.background_style}`);
    lines.push("");

    panelKeys.forEach((key) => {
      const panel = prompt.panels[key];
      const imagePrompt = panel.image_prompt || panel.scene;
      lines.push(`【${panel.description}】`);
      lines.push(imagePrompt);
      if (panel.text) {
        lines.push(`文案：${panel.text}`);
      }
      lines.push("");
    });

    return lines.join("\n");
  },
});
