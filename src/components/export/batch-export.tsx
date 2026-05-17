"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { getPanelKeys } from "@/types/storyboard";
import type { StoryboardScript } from "@/types/storyboard";

interface BatchExportProps {
  prompt: StoryboardScript;
}

export function BatchExport({ prompt }: BatchExportProps) {
  const panelKeys = getPanelKeys(prompt);
  const allPrompts = panelKeys
    .map((key, i) => {
      const panel = prompt.panels[key];
      return `【${panel.description || `第${i + 1}格`}】\n${panel.image_prompt || ""}`;
    })
    .join("\n\n---\n\n");

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(allPrompts);
  };

  const handleDownloadAll = () => {
    const blob = new Blob([allPrompts], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "storycraft-prompts-all.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          📦 批量导出（{panelKeys.length} 个面板）
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <Copy className="mr-1 h-3 w-3" />
            一键复制全部
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadAll}>
            <Download className="mr-1 h-3 w-3" />
            下载全部
          </Button>
        </div>
      </div>
      <pre className="max-h-[200px] overflow-auto rounded border border-gray-100 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
        {allPrompts}
      </pre>
    </div>
  );
}
