"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import type { Character } from "@/types/character";

interface CharacterEditorProps {
  character: Character;
  onChange: (character: Character) => void;
  disabled?: boolean;
}

export function CharacterEditor({
  character,
  onChange,
  disabled,
}: CharacterEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <User className="h-4 w-4" />
        定义角色档案，确保所有分镜中人物形象一致
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            角色名称
          </label>
          <Input
            placeholder="如：小火柴"
            value={character.name}
            onChange={(e) =>
              onChange({ ...character, name: e.target.value })
            }
            disabled={disabled}
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            外貌特征
          </label>
          <Input
            placeholder="如：细长圆柱身体、红色火柴头、圆点眼睛、呆萌可爱"
            value={character.appearance}
            onChange={(e) =>
              onChange({ ...character, appearance: e.target.value })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          性格特点
        </label>
        <Textarea
          placeholder="如：迷糊、天真、略倒霉"
          value={character.personality}
          onChange={(e) =>
            onChange({ ...character, personality: e.target.value })
          }
          className="min-h-[60px] resize-none"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
