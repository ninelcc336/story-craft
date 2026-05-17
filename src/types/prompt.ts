import type { StoryboardScript } from "./storyboard";

export type StructuredPrompt = StoryboardScript;

export interface PromptGenerateInput {
  storyboard: StoryboardScript;
}
