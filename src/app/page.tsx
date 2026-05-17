"use client";

import { useState } from "react";
import { useStoryContext, useStoryActions } from "@/lib/store/story-context";
import type { StoryStyle } from "@/types/story";
import { Header } from "@/components/layout/header";
import { StepCard } from "@/components/layout/pipeline-layout";
import { StyleSelector } from "@/components/story/style-selector";
import { StoryInput } from "@/components/story/story-input";
import { StoryDisplay } from "@/components/story/story-display";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { state, dispatch } = useStoryContext();
  const actions = useStoryActions();
  const [storyStyle, setStoryStyle] = useState<StoryStyle>("搞笑");

  const handleGenerate = (topic: string) => {
    actions.generateStory(topic, storyStyle);
  };

  const handleExpand = (summary: string) => {
    actions.expandStory(summary, storyStyle);
  };

  const handleContentChange = (content: string) => {
    if (state.story) {
      dispatch({
        type: "SET_STORY",
        payload: { ...state.story!, content, wordCount: content.length },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onReset={actions.reset} />

      <main className="mx-auto max-w-2xl space-y-6 p-6">
        {/* Step 1: Story Generation */}
        <StepCard title="故事生成" step={1} badge="B1/B2">
          <div className="space-y-4">
            <StyleSelector
              value={storyStyle}
              onChange={setStoryStyle}
              disabled={state.isGeneratingStory || state.isExpanding}
            />

            <Separator />

            <StoryInput
              style={storyStyle}
              onGenerate={handleGenerate}
              onExpand={handleExpand}
              isLoading={state.isGeneratingStory}
              isExpanding={state.isExpanding}
            />

            <StoryDisplay
              story={state.story}
              isLoading={state.isGeneratingStory || state.isExpanding}
              error={state.storyError}
              onContentChange={handleContentChange}
            />
          </div>
        </StepCard>

        {/* Placeholder for subsequent steps */}
        {state.story && (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
            分镜脚本生成、角色管理、提示词导出等功能即将接入...
          </div>
        )}
      </main>
    </div>
  );
}
