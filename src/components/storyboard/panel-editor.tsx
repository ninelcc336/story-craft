"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PanelEditorProps {
  panel: {
    description: string;
    scene: string;
    action: string;
    expression: string;
    details: string;
    text: string;
  };
  onChange: (field: string, value: string) => void;
  onClose: () => void;
}

const FIELD_CONFIG: { field: string; label: string; rows: number }[] = [
  { field: "description", label: "作用说明", rows: 1 },
  { field: "scene", label: "场景描述", rows: 2 },
  { field: "action", label: "角色动作", rows: 1 },
  { field: "expression", label: "角色表情", rows: 1 },
  { field: "details", label: "视觉细节", rows: 2 },
  { field: "text", label: "文案/对话", rows: 2 },
];

export function PanelEditor({ panel, onChange, onClose }: PanelEditorProps) {
  return (
    <div className="space-y-3 rounded-lg border-2 border-gray-900 bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900">编辑分镜</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          完成
        </Button>
      </div>
      <div className="space-y-3">
        {FIELD_CONFIG.map(({ field, label, rows }) => (
          <div key={field}>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              {label}
            </label>
            <Textarea
              value={(panel as Record<string, string>)[field] || ""}
              onChange={(e) => onChange(field, e.target.value)}
              className="min-h-0 resize-none"
              rows={rows}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
