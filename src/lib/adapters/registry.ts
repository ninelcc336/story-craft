import type { StoryboardScript } from "@/types/storyboard";
import type { AdapterId } from "@/types/adapter";

export interface AgentAdapter {
  id: AdapterId;
  name: string;
  description: string;
  adapt(prompt: StoryboardScript): string;
}

const registry = new Map<AdapterId, AgentAdapter>();

export function registerAdapter(adapter: AgentAdapter): void {
  registry.set(adapter.id, adapter);
}

export function getAdapter(id: AdapterId): AgentAdapter {
  const adapter = registry.get(id);
  if (!adapter) throw new Error(`未知适配器：${id}`);
  return adapter;
}

export function listAdapters(): AgentAdapter[] {
  return Array.from(registry.values());
}

export function adaptPrompt(
  prompt: StoryboardScript,
  adapterId: AdapterId
): string {
  const adapter = getAdapter(adapterId);
  return adapter.adapt(prompt);
}
