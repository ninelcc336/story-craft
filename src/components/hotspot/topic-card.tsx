"use client";

import { Badge } from "@/components/ui/badge";
import type { HotTopic } from "@/types/hotspot";
import { PHASE_LABELS } from "@/types/hotspot";

interface TopicCardProps {
  topic: HotTopic;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function TopicCard({ topic, isSelected, onClick, disabled }: TopicCardProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? "border-gray-900 bg-gray-50 shadow-sm"
          : "border-gray-200 hover:border-gray-300 bg-white"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-800 line-clamp-2">
          {topic.title}
        </span>
        <span className="shrink-0 text-lg">
          {"🔥".repeat(topic.heat)}
        </span>
      </div>
      <p className="mb-2 text-xs text-gray-400 line-clamp-1">{topic.summary}</p>
      <div className="flex items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px]">
          {topic.category}
        </Badge>
        <span className="text-[10px] text-gray-400">{PHASE_LABELS[topic.phase]}</span>
        <span className="ml-auto text-[10px] text-gray-300">{topic.source}</span>
      </div>
    </button>
  );
}
