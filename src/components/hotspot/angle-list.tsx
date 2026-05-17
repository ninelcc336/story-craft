"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import type { StoryAngle } from "@/types/hotspot";
import { STORY_STYLES } from "@/types/story";

interface AngleListProps {
  angles: StoryAngle[];
  isSelected?: string;
  onSelect: (angle: StoryAngle) => void;
  disabled?: boolean;
}

export function AngleList({ angles, isSelected, onSelect, disabled }: AngleListProps) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
        <Sparkles className="h-3 w-3" />
        AI 推荐的故事切入角度
      </p>
      {angles.map((angle) => {
        const selected = isSelected === angle.id;
        const styleLabel = STORY_STYLES.find(
          (s) => s.value === angle.suggestedStyle
        )?.label;

        return (
          <div
            key={angle.id}
            className={`rounded-lg border p-3 transition-all ${
              selected
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-1.5 flex items-start gap-2">
              <span className="text-sm font-medium text-gray-800">
                {angle.angle}
              </span>
              {styleLabel && (
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {styleLabel}
                </Badge>
              )}
            </div>
            <p className="mb-2 text-xs text-gray-400">{angle.rationale}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                {angle.sampleTopic}
              </code>
              <Button
                size="sm"
                variant={selected ? "secondary" : "outline"}
                disabled={disabled}
                onClick={() => onSelect(angle)}
                className="shrink-0"
              >
                {selected ? "已选中" : <>
                  选用 <ArrowRight className="ml-1 h-3 w-3" />
                </>}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
