"use client";

import { useState } from "react";
import { useStoryContext, useStoryActions } from "@/lib/store/story-context";
import type { StoryStyle } from "@/types/story";
import { Header } from "@/components/layout/header";
import { StepCard } from "@/components/layout/pipeline-layout";
import { StyleSelector } from "@/components/story/style-selector";
import { StoryInput } from "@/components/story/story-input";
import { StoryDisplay } from "@/components/story/story-display";
import { CharacterEditor } from "@/components/character/character-editor";
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

        {/* Step 2: Character Profile */}
        {state.story && (
          <StepCard title="角色档案" step={2} badge="B7">
            <CharacterEditor
              character={state.character}
              onChange={actions.setCharacter}
              disabled={state.isGeneratingStoryboard}
            />
          </StepCard>
        )}

        {/* Step 3: Storyboard - will be wired in M5 */}
        {state.story && (
          <StepCard title="分镜脚本" step={3} badge="B3">
            <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
              {state.isGeneratingStoryboard
                ? "正在生成分镜脚本..."
                : state.storyboard
                ? `已生成 ${Object.keys(state.storyboard.panels).length} 个分镜`
                : "点击下方按钮开始生成分镜脚本"}
            </div>
          </StepCard>
        )}

        {/* Step 4: Prompt & Export - placeholder */}
        {state.storyboard && (
          <StepCard title="提示词导出" step={4} badge="C1/C2">
            <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
              提示词生成和 Agent 适配导出即将接入...
            </div>
          </StepCard>
        )}
      </main>
    </div>
  );
}
