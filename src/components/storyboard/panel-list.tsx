"use client";

import { useState } from "react";
import { PanelCard } from "./panel-card";
import { PanelEditor } from "./panel-editor";
import type { StoryboardScript } from "@/types/storyboard";
import { getPanelKeys } from "@/types/storyboard";

interface PanelListProps {
  storyboard: StoryboardScript;
  onUpdatePanel: (key: string, field: string, value: string) => void;
}

export function PanelList({ storyboard, onUpdatePanel }: PanelListProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const panelKeys = getPanelKeys(storyboard);

  return (
    <div className="space-y-3">
      {panelKeys.map((key, i) => (
        <div key={key}>
          {editingKey === key ? (
            <PanelEditor
              panel={storyboard.panels[key]}
              onChange={(field, value) => onUpdatePanel(key, field, value)}
              onClose={() => setEditingKey(null)}
            />
          ) : (
            <PanelCard
              index={i}
              label={key.replace("panel", "第 ") + " 格"}
              panel={storyboard.panels[key]}
              onEdit={() => setEditingKey(key)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
