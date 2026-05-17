"use client";

const SETTINGS_KEY = "storycraft-settings";
const COOKIE_KEY = "storycraft_api_key";

export interface LLMSettings {
  apiKey: string;
  provider: "claude" | "openai";
  model: string;
}

const DEFAULT_MODELS: Record<LLMSettings["provider"], string> = {
  claude: "claude-sonnet-4-6",
  openai: "gpt-4o",
};

export function loadSettings(): LLMSettings {
  if (typeof window === "undefined") {
    return { apiKey: "", provider: "claude", model: "claude-sonnet-4-6" };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { apiKey: "", provider: "claude", model: DEFAULT_MODELS["claude"] };
    const parsed = JSON.parse(raw);
    const provider: LLMSettings["provider"] =
      parsed.provider === "openai" ? "openai" : "claude";
    return {
      apiKey: parsed.apiKey || "",
      provider,
      model: parsed.model || DEFAULT_MODELS[provider],
    };
  } catch {
    return { apiKey: "", provider: "claude", model: DEFAULT_MODELS["claude"] };
  }
}

export function saveSettings(settings: LLMSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Also set cookie for server-side access
    if (settings.apiKey) {
      document.cookie = `${COOKIE_KEY}=${encodeURIComponent(settings.apiKey)};path=/;max-age=2592000;SameSite=Lax`;
    }
    if (settings.provider) {
      document.cookie = `storycraft_provider=${settings.provider};path=/;max-age=2592000;SameSite=Lax`;
    }
    if (settings.model) {
      document.cookie = `storycraft_model=${encodeURIComponent(settings.model)};path=/;max-age=2592000;SameSite=Lax`;
    }
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

export function getSettingsForAPI(): LLMSettings {
  return loadSettings();
}
