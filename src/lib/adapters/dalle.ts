import { registerAdapter } from "./registry";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

registerAdapter({
  id: "dalle",
  name: "DALL-E 3",
  description: "适用于 OpenAI DALL-E 3 的英文提示词",
  adapt(prompt: StoryboardScript): string {
    const { comic_info } = prompt;
    const panelKeys = getPanelKeys(prompt);

    const lines: string[] = [];
    lines.push(`Create a ${comic_info.type} comic series.`);
    lines.push("");
    lines.push(`Visual style: ${comic_info.style}`);
    lines.push(`Color palette: ${comic_info.color_scheme}`);
    lines.push(
      `Character: ${comic_info.character?.name || "Main character"} - Appearance: ${comic_info.character?.appearance || ""} - Personality: ${comic_info.character?.personality || ""}`
    );
    lines.push(`Background style: ${comic_info.background_style}`);
    lines.push("");

    panelKeys.forEach((key, i) => {
      const panel = prompt.panels[key];
      const imagePrompt = panel.image_prompt || `${panel.scene}. ${panel.action}. Expression: ${panel.expression}`;
      lines.push(`--- Panel ${i + 1}: ${panel.description} ---`);
      lines.push(`English prompt: ${imagePrompt} Additional details: ${panel.details}.`);
      if (panel.text) {
        lines.push(`Caption text: "${panel.text}"`);
      }
      lines.push("");
    });

    lines.push("IMPORTANT: Maintain consistent character design across all panels. Same character features must appear in every image.");

    return lines.join("\n");
  },
});
