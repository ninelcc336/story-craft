"use client";

import { Separator } from "@/components/ui/separator";
import { AdapterSelector } from "@/components/prompt/adapter-selector";
import { CopyButton } from "@/components/export/copy-button";
import type { AdapterId } from "@/types/adapter";
import { adaptPrompt } from "@/lib/adapters/index";
import type { StoryboardScript } from "@/types/storyboard";

interface ExportPanelProps {
  prompt: StoryboardScript;
  selectedAdapter: AdapterId;
  onAdapterChange: (id: AdapterId) => void;
}

export function ExportPanel({
  prompt,
  selectedAdapter,
  onAdapterChange,
}: ExportPanelProps) {
  const adaptedOutput = (() => {
    try {
      return adaptPrompt(prompt, selectedAdapter);
    } catch {
      return "适配器处理出错，请稍后重试";
    }
  })();

  return (
    <div className="space-y-4">
      <AdapterSelector
        value={selectedAdapter}
        onChange={onAdapterChange}
      />

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            📋 适配后输出
          </span>
          <CopyButton text={adaptedOutput} label="复制输出" />
        </div>
        <pre className="max-h-[300px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed whitespace-pre-wrap">
          {adaptedOutput}
        </pre>
      </div>
    </div>
  );
}
