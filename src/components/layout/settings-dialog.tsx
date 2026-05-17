"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Save, Eye, EyeOff } from "lucide-react";
import {
  loadSettings,
  saveSettings,
  type LLMSettings,
} from "@/lib/store/settings-store";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [settings, setSettings] = useState<LLMSettings>({
    apiKey: "",
    provider: "claude",
    model: "claude-sonnet-4-6",
  });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setSettings(loadSettings());
      setSaved(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => {
      onClose();
      window.location.reload(); // refresh to pick up new API key
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">LLM 配置</h2>
            <p className="text-xs text-gray-400">
              配置 API Key 后即可使用所有 AI 功能
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Provider */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              AI 服务商
            </label>
            <div className="flex gap-2">
              {(["claude", "openai"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSettings({
                      ...settings,
                      provider: p,
                    });
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    settings.provider === p
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p === "claude" ? "Anthropic Claude" : "OpenAI GPT"}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              API Key
            </label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings({ ...settings, apiKey: e.target.value })
                }
                placeholder={
                  settings.provider === "claude"
                    ? "sk-ant-api03-..."
                    : "sk-proj-..."
                }
                className="pr-10 font-mono text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              模型
            </label>
            <Input
              type="text"
              value={settings.model}
              onChange={(e) =>
                setSettings({ ...settings, model: e.target.value })
              }
              placeholder="claude-sonnet-4-6"
              className="font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">
              输入模型名称，例如 claude-sonnet-4-6 / gpt-4o / deepseek-v3 等
            </p>
          </div>

          <Separator />

          {/* Info */}
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-blue-700">
              API Key 仅保存在浏览器本地存储中，不会上传到任何服务器。
              {settings.provider === "claude"
                ? " 前往 console.anthropic.com 获取 Key。"
                : " 前往 platform.openai.com 获取 Key。"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <span className="text-xs text-gray-400">
            配置持久化到浏览器 localStorage
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={settings.apiKey.length < 10}
            >
              <Save className="mr-1.5 h-4 w-4" />
              {saved ? "已保存 ✓" : "保存配置"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
