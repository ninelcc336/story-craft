"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useState } from "react";
import { stringifyYaml, stringifyJson, downloadFile } from "@/lib/utils/export";
import { CopyButton } from "@/components/export/copy-button";
import type { StoryboardScript } from "@/types/storyboard";

interface PromptPreviewProps {
  prompt: StoryboardScript;
  isLoading: boolean;
  error: string | null;
}

export function PromptPreview({ prompt, isLoading, error }: PromptPreviewProps) {
  const [format, setFormat] = useState<"yaml" | "json">("yaml");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-8 text-sm text-gray-400">
        AI 正在生成生图提示词...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
        点击"生成提示词"为每个分镜补充 AI 生图提示词
      </div>
    );
  }

  const yamlStr = stringifyYaml(prompt);
  const jsonStr = stringifyJson(prompt);
  const displayStr = format === "yaml" ? yamlStr : jsonStr;

  const hasImagePrompts = Object.values(prompt.panels).some(
    (p) => !!p.image_prompt
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tabs
            value={format}
            onValueChange={(v) => setFormat(v as "yaml" | "json")}
          >
            <TabsList>
              <TabsTrigger value="yaml">YAML</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
          </Tabs>
          {hasImagePrompts && (
            <span className="text-xs text-green-600">
              ✓ 已包含 image_prompt
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <CopyButton text={displayStr} label="复制全部" />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadFile(
                displayStr,
                `storycraft-prompt.${format}`,
                format === "json" ? "application/json" : "text/yaml"
              )
            }
          >
            <Download className="mr-1 h-3 w-3" />
            下载
          </Button>
        </div>
      </div>

      <pre className="max-h-[400px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed">
        {displayStr}
      </pre>
    </div>
  );
}
