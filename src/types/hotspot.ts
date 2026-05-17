import type { StoryStyle } from "./story";

export type HotspotCategory = "情感" | "职场" | "育儿" | "宠物" | "社会" | "科技" | "娱乐" | "生活";
export type HotspotPhase = "萌芽期" | "爆发期" | "衰退期";

export const HOTSPOT_CATEGORIES: HotspotCategory[] = [
  "情感", "职场", "育儿", "宠物", "社会", "科技", "娱乐", "生活",
];

export const PHASE_LABELS: Record<HotspotPhase, string> = {
  "萌芽期": "🌱 萌芽期",
  "爆发期": "🔥 爆发期",
  "衰退期": "🥀 衰退期",
};

export interface HotTopic {
  id: string;
  title: string;
  summary: string;
  category: HotspotCategory;
  heat: number; // 1-5
  phase: HotspotPhase;
  source: string;
}

export interface StoryAngle {
  id: string;
  angle: string;
  suggestedStyle: StoryStyle;
  sampleTopic: string;
  rationale: string;
}
