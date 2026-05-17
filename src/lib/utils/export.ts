import * as yaml from "js-yaml";
import type { StoryboardScript } from "@/types/storyboard";

export function stringifyYaml(data: StoryboardScript): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
}

export function stringifyJson(data: StoryboardScript): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
