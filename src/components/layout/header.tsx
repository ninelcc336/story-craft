"use client";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          StoryCraft AI
          <span className="ml-2 text-sm font-normal text-gray-400">
            故事工坊
          </span>
        </h1>
        <p className="text-xs text-gray-400">
          AI故事图文创作助手 · Phase 1
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onReset}>
          新建项目
        </Button>
      </div>
    </header>
  );
}
