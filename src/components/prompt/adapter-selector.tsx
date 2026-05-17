"use client";

import type { AdapterId } from "@/types/adapter";
import { ADAPTER_LIST } from "@/types/adapter";
import { cn } from "@/lib/utils/cn";

interface AdapterSelectorProps {
  value: AdapterId;
  onChange: (id: AdapterId) => void;
  disabled?: boolean;
}

export function AdapterSelector({
  value,
  onChange,
  disabled,
}: AdapterSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        选择目标生图工具，自动转译提示词格式
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ADAPTER_LIST.map((a) => (
          <button
            key={a.id}
            disabled={disabled}
            onClick={() => onChange(a.id)}
            className={cn(
              "rounded-lg border p-3 text-left transition-all",
              value === a.id
                ? "border-gray-900 bg-gray-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="text-sm font-medium text-gray-800">{a.name}</div>
            <div className="mt-0.5 text-xs text-gray-400">
              {a.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
