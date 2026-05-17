import type { Character } from "./character";

export interface ComicInfo {
  type: string;
  style: string;
  color_scheme: string;
  character: Character;
  background_style: string;
}

export interface Panel {
  description: string;
  scene: string;
  action: string;
  expression: string;
  details: string;
  text: string;
  image_prompt?: string;
}

export interface StoryboardScript {
  comic_info: ComicInfo;
  panels: Record<string, Panel>;
}

export function getPanelCount(storyboard: StoryboardScript): number {
  return Object.keys(storyboard.panels).length;
}

export function getPanelKeys(storyboard: StoryboardScript): string[] {
  return Object.keys(storyboard.panels).sort((a, b) => {
    const numA = parseInt(a.replace("panel", ""), 10);
    const numB = parseInt(b.replace("panel", ""), 10);
    return numA - numB;
  });
}

export function validateStoryboard(
  storyboard: unknown
): storyboard is StoryboardScript {
  if (!storyboard || typeof storyboard !== "object") return false;
  const sb = storyboard as Record<string, unknown>;
  if (!sb.comic_info || typeof sb.comic_info !== "object") return false;
  if (!sb.panels || typeof sb.panels !== "object") return false;

  const panelKeys = Object.keys(sb.panels);
  if (panelKeys.length < 2) return false;

  const required = [
    "description",
    "scene",
    "action",
    "expression",
    "details",
    "text",
  ];
  for (const key of panelKeys) {
    const panel = (sb.panels as Record<string, unknown>)[key];
    if (!panel || typeof panel !== "object") return false;
    for (const field of required) {
      if (
        !(field in panel) ||
        typeof (panel as Record<string, unknown>)[field] !== "string"
      ) {
        return false;
      }
    }
  }

  return true;
}
