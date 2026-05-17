"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Story } from "@/types/story";

interface StoryDisplayProps {
  story: Story | null;
  isLoading: boolean;
  error: string | null;
  onContentChange?: (content: string) => void;
}

export function StoryDisplay({
  story,
  isLoading,
  error,
  onContentChange,
}: StoryDisplayProps) {
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-sm text-gray-400">
        AI 正在创作故事...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!story) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
        请先输入主题，然后点击"生成故事"
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{story.style}</Badge>
        <span className="text-xs text-gray-400">{story.wordCount} 字</span>
        <button
          onClick={() => setEditing(!editing)}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600"
        >
          {editing ? "完成编辑" : "编辑文本"}
        </button>
      </div>

      {editing ? (
        <Textarea
          value={story.content}
          onChange={(e) => onContentChange?.(e.target.value)}
          className="min-h-[300px] resize-y font-sans leading-relaxed"
        />
      ) : (
        <div className="prose prose-sm max-w-none rounded-lg border border-gray-100 bg-gray-50 p-4">
          {story.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-2 leading-relaxed text-gray-800">
              {paragraph || " "}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
