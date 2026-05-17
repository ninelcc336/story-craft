"use client";

const SETTINGS_KEY = "storycraft-settings";

export interface LLMSettings {
  apiKey: string;
  provider: "claude" | "openai";
  model: string;
  baseUrl: string;
}

export function loadSettings(): LLMSettings {
  if (typeof window === "undefined") {
    return { apiKey: "", provider: "claude", model: "claude-sonnet-4-6", baseUrl: "" };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { apiKey: "", provider: "claude", model: "claude-sonnet-4-6", baseUrl: "" };
    const parsed = JSON.parse(raw);
    return {
      apiKey: parsed.apiKey || "",
      provider: parsed.provider === "openai" ? "openai" : "claude",
      model: parsed.model || "claude-sonnet-4-6",
      baseUrl: parsed.baseUrl || "",
    };
  } catch {
    return { apiKey: "", provider: "claude", model: "claude-sonnet-4-6", baseUrl: "" };
  }
}

function setCookie(name: string, value: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=2592000;SameSite=Lax`;
}

export function saveSettings(settings: LLMSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setCookie("storycraft_api_key", settings.apiKey);
    setCookie("storycraft_provider", settings.provider);
    setCookie("storycraft_model", settings.model);
    setCookie("storycraft_base_url", settings.baseUrl);
  } catch {
    // silently fail
  }
}

export function hasValidApiKey(): boolean {
  const settings = loadSettings();
  return (
    !!settings.apiKey &&
    settings.apiKey.length > 10 &&
    settings.apiKey !== "sk-ant-..."
  );
}
