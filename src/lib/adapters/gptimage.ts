import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "gptimage",
  name: "Gpt-image-2",
  description: "适用于 OpenAI GPT Image 2 的生图提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);
    const lines: string[] = [];
    lines.push(`Create a ${comic_info.type} comic series.`);
    lines.push(`Style: ${comic_info.style}`);
    lines.push(`Color scheme: ${comic_info.color_scheme}`);
    lines.push(`Character: ${comic_info.character?.name || "Main character"} - ${comic_info.character?.appearance || ""}`);
    lines.push(`Background: ${comic_info.background_style}`);
    lines.push("");
    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`Panel ${i + 1}: ${panel.description}`);
      lines.push(
        `Prompt: ${panel.image_prompt || panel.scene}. ${panel.action}. Expression: ${panel.expression}.`
      );
      if (panel.text) lines.push(`Caption: "${panel.text}"`);
      lines.push("");
    });
    lines.push("Maintain consistent character appearance across all panels.");
    return lines.join("\n");
  },
});
