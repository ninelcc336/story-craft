"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { STYLE_PRESETS } from "@/lib/presets/styles";
import type { VisualStyle } from "@/types/preset";
import { Sparkles } from "lucide-react";

interface StylePresetSelectorProps {
  value: string | null;
  onChange: (preset: VisualStyle) => void;
  disabled?: boolean;
}

export function StylePresetSelector({
  value,
  onChange,
  disabled,
}: StylePresetSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const visiblePresets = showAll ? STYLE_PRESETS : STYLE_PRESETS.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="h-4 w-4" />
        视觉风格预设（自动注入 comic_info）
      </div>

      <div className="grid grid-cols-2 gap-2">
        {visiblePresets.map((preset) => (
          <button
            key={preset.id}
            disabled={disabled}
            onClick={() => onChange(preset)}
            className={cn(
              "rounded-lg border p-3 text-left transition-all",
              value === preset.id
                ? "border-gray-900 bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {/* Color Preview Bar */}
            <div
              className="mb-2 h-2 w-full rounded"
              style={{
                background: `linear-gradient(to right, ${preset.previewColors.join(", ")})`,
              }}
            />
            <div className="mb-1 text-sm font-medium text-gray-800">
              {preset.name}
            </div>
            <div className="mb-2 text-[11px] text-gray-400 line-clamp-2">
              {preset.style}
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-[10px]">
                {preset.suitableFor}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      {STYLE_PRESETS.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full rounded py-1 text-xs text-gray-400 hover:text-gray-600"
        >
          {showAll
            ? "收起"
            : `查看全部 ${STYLE_PRESETS.length} 种风格...`}
        </button>
      )}
    </div>
  );
}
