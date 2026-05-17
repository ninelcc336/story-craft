"use client";

import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/export/copy-button";
import { Separator } from "@/components/ui/separator";

interface PromptCardProps {
  index: number;
  label: string;
  panel: {
    description: string;
    image_prompt?: string;
    negative_prompt?: string;
    text?: string;
    tech_params?: Record<string, unknown>;
  };
}

export function PromptCard({ index, label, panel }: PromptCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <Badge variant="outline" className="text-[10px]">
            {panel.description}
          </Badge>
        </div>
        {panel.image_prompt && (
          <CopyButton text={panel.image_prompt} label="复制提示词" />
        )}
      </div>

      {panel.image_prompt ? (
        <>
          <div className="rounded-md bg-blue-50 p-3">
            <span className="text-[10px] font-medium text-blue-600">
              🎨 正向提示词 (image_prompt)
            </span>
            <p className="mt-1 text-sm leading-relaxed text-gray-800">
              {panel.image_prompt}
            </p>
          </div>

          {panel.negative_prompt && (
            <div className="mt-2 rounded-md bg-red-50 p-3">
              <span className="text-[10px] font-medium text-red-500">
                🚫 负面提示词 (negative_prompt)
              </span>
              <p className="mt-1 text-xs text-gray-600">
                {typeof panel.negative_prompt === "string"
                  ? panel.negative_prompt
                  : "—"}
              </p>
            </div>
          )}

          {panel.text && (
            <div className="mt-2 rounded-md bg-amber-50 p-2">
              <span className="text-[10px] font-medium text-amber-600">
                💬 文案
              </span>
              <span className="ml-2 text-sm text-gray-800">{panel.text}</span>
            </div>
          )}

          {panel.tech_params && (
            <div className="mt-2 rounded-md bg-gray-50 p-2">
              <span className="text-[10px] font-medium text-gray-500">
                ⚙️ 技术参数
              </span>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(panel.tech_params).map(([k, v]) => (
                  <span key={k} className="text-xs text-gray-500">
                    {k}: {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-4 text-center text-sm text-gray-400">
          暂无提示词，请先生成
        </div>
      )}
    </div>
  );
}
