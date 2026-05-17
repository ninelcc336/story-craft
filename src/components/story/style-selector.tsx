"use client";

import { cn } from "@/lib/utils/cn";
import type { StoryStyle } from "@/types/story";
import { STORY_STYLES } from "@/types/story";

interface StyleSelectorProps {
  value: StoryStyle;
  onChange: (style: StoryStyle) => void;
  disabled?: boolean;
}

export function StyleSelector({
  value,
  onChange,
  disabled,
}: StyleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STORY_STYLES.map((s) => (
        <button
          key={s.value}
          disabled={disabled}
          onClick={() => onChange(s.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            value === s.value
              ? "bg-gray-900 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
