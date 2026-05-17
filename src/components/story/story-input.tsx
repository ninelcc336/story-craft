"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import type { StoryStyle } from "@/types/story";

interface StoryInputProps {
  style: StoryStyle;
  externalTopic?: string | null;
  onTopicConsumed?: () => void;
  onGenerate: (topic: string) => void;
  onExpand: (summary: string) => void;
  isLoading: boolean;
  isExpanding: boolean;
  disabled?: boolean;
}

export function StoryInput({
  style,
  externalTopic,
  onTopicConsumed,
  onGenerate,
  onExpand,
  isLoading,
  isExpanding,
  disabled,
}: StoryInputProps) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (externalTopic) {
      setInput(externalTopic);
      onTopicConsumed?.();
    }
  }, [externalTopic, onTopicConsumed]);
  const [mode, setMode] = useState<"generate" | "expand">("generate");

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (mode === "generate") {
      onGenerate(input.trim());
    } else {
      onExpand(input.trim());
    }
  };

  const busy = isLoading || isExpanding;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("generate")}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            mode === "generate"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Sparkles className="mr-1 inline-block h-3 w-3" />
          主题生成
        </button>
        <button
          onClick={() => setMode("expand")}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            mode === "expand"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Wand2 className="mr-1 inline-block h-3 w-3" />
          梗概扩展
        </button>
      </div>

      <Textarea
        placeholder={
          mode === "generate"
            ? "输入故事主题，例如：一只猫在城市里冒险..."
            : "输入一句话梗概，例如：一个小火柴找工作屡屡碰壁的故事..."
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[100px] resize-y"
        disabled={busy || disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
          }
        }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {mode === "generate"
            ? `当前风格：${style} · Ctrl+Enter 生成`
            : "将一句话扩展为完整故事 · Ctrl+Enter 扩展"}
        </span>
        <Button onClick={handleSubmit} disabled={busy || !input.trim()}>
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isExpanding ? "扩展中..." : "生成中..."}
            </>
          ) : mode === "generate" ? (
            "生成故事"
          ) : (
            "扩展故事"
          )}
        </Button>
      </div>
    </div>
  );
}
