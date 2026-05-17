export type StoryStyle = "温情" | "悬疑" | "搞笑" | "治愈" | "励志";

export type WritingStyle = "口语化" | "文学化" | "网感化" | "治愈系";

export const STORY_STYLES: { value: StoryStyle; label: string }[] = [
  { value: "温情", label: "🤗 温情" },
  { value: "悬疑", label: "🕵️ 悬疑" },
  { value: "搞笑", label: "😂 搞笑" },
  { value: "治愈", label: "🌿 治愈" },
  { value: "励志", label: "🔥 励志" },
];

export const WRITING_STYLES: { value: WritingStyle; label: string }[] = [
  { value: "口语化", label: "口语化" },
  { value: "文学化", label: "文学化" },
  { value: "网感化", label: "网感化" },
  { value: "治愈系", label: "治愈系" },
];

export interface Story {
  content: string;
  title: string;
  style: StoryStyle;
  wordCount: number;
}
