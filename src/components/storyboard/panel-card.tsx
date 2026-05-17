"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PanelCardProps {
  index: number;
  label: string;
  panel: {
    description: string;
    scene: string;
    action: string;
    expression: string;
    details: string;
    text: string;
    image_prompt?: string;
  };
  onEdit?: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  description: "作用",
  scene: "场景",
  action: "动作",
  expression: "表情",
  details: "细节",
  text: "text (文案)",
};

export function PanelCard({ index, label, panel, onEdit }: PanelCardProps) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <Badge variant="outline" className="text-[10px]">
            {panel.description}
          </Badge>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-gray-400 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
          >
            编辑
          </button>
        )}
      </div>

      <Separator className="mb-3" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {(["scene", "action", "expression", "details"] as const).map(
          (field) => (
            <div key={field} className="flex flex-col">
              <span className="text-[10px] font-medium text-gray-400 uppercase">
                {FIELD_LABELS[field]}
              </span>
              <span className="text-sm text-gray-700">{panel[field]}</span>
            </div>
          )
        )}
      </div>

      <div className="mt-2 rounded-md bg-amber-50 px-3 py-2">
        <span className="text-[10px] font-medium text-amber-600">💬 text (文案)</span>
        <p className="text-sm text-gray-800">{panel.text}</p>
      </div>
    </div>
  );
}
