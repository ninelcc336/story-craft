import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "gemini",
  name: "Gemini Imagen",
  description: "适用于 Google Gemini 生图模型的提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);

    const lines: string[] = [];
    lines.push(`Generate a ${comic_info.type} comic series with the following specifications:`);
    lines.push("");
    lines.push(`Style: ${comic_info.style}`);
    lines.push(`Color scheme: ${comic_info.color_scheme}`);
    lines.push(`Character: ${comic_info.character?.name || "Main character"} - ${comic_info.character?.appearance || ""}`);
    lines.push(`Background: ${comic_info.background_style}`);
    lines.push("");

    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      lines.push(`Panel ${i + 1}: ${panel.description}`);
      lines.push(`Prompt: ${panel.image_prompt || panel.scene}. ${panel.action}. Expression: ${panel.expression}. Details: ${panel.details}`);
      if (panel.text) {
        lines.push(`Text overlay: "${panel.text}"`);
      }
      lines.push("");
    });

    lines.push("Generate each panel separately, maintaining consistent character appearance across all panels.");

    return lines.join("\n");
  },
});
