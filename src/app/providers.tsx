"use client";

import { StoryProvider } from "@/lib/store/story-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoryProvider>{children}</StoryProvider>;
}
