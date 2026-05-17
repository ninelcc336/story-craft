import { NextRequest } from "next/server";

export function getApiKeyFromRequest(request: NextRequest): string {
  const cookie = request.cookies.get("storycraft_api_key")?.value;
  if (cookie) return decodeURIComponent(cookie);
  return process.env.ANTHROPIC_API_KEY || "";
}

export function getProviderFromRequest(request: NextRequest): string {
  return request.cookies.get("storycraft_provider")?.value || "claude";
}

export function getModelFromRequest(request: NextRequest): string {
  const cookie = request.cookies.get("storycraft_model")?.value;
  if (cookie) return decodeURIComponent(cookie);
  return "claude-sonnet-4-6";
}

export function getBaseUrlFromRequest(request: NextRequest): string {
  const cookie = request.cookies.get("storycraft_base_url")?.value;
  if (cookie) return decodeURIComponent(cookie);
  return "";
}
