"use client";

import { cn } from "@/lib/utils/cn";
import type { WritingStyle } from "@/types/story";
import { WRITING_STYLES } from "@/types/story";

interface WritingStyleSelectorProps {
  value: WritingStyle | null;
  onChange: (style: WritingStyle) => void;
  disabled?: boolean;
}

export function WritingStyleSelector({
  value,
  onChange,
  disabled,
}: WritingStyleSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        切换文案风格（仅修改分镜中的 text 字段，不影响场景和动作描述）
      </p>
      <div className="flex flex-wrap gap-2">
        {WRITING_STYLES.map((s) => (
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
    </div>
  );
}
