"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { stringifyYaml, stringifyJson, downloadFile } from "@/lib/utils/export";
import type { StoryboardScript } from "@/types/storyboard";

interface StoryboardPreviewProps {
  storyboard: StoryboardScript;
}

export function StoryboardPreview({ storyboard }: StoryboardPreviewProps) {
  const [format, setFormat] = useState<"yaml" | "json">("yaml");
  const [copied, setCopied] = useState(false);

  const yamlStr = stringifyYaml(storyboard);
  const jsonStr = stringifyJson(storyboard);

  const handleCopy = async () => {
    const text = format === "yaml" ? yamlStr : jsonStr;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = format === "yaml" ? yamlStr : jsonStr;
    const ext = format === "yaml" ? "yaml" : "json";
    downloadFile(text, `storyboard.${ext}`, format === "json" ? "application/json" : "text/yaml");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Tabs value={format} onValueChange={(v) => setFormat(v as "yaml" | "json")}>
          <TabsList>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-1 h-3 w-3" />
            {copied ? "已复制" : "复制"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-3 w-3" />
            下载
          </Button>
        </div>
      </div>
      <pre className="max-h-[500px] overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed">
        {format === "yaml" ? yamlStr : jsonStr}
      </pre>
    </div>
  );
}
