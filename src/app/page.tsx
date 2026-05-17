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
import { PanelList } from "@/components/storyboard/panel-list";
import { StoryboardPreview } from "@/components/storyboard/storyboard-preview";
import { Button } from "@/components/ui/button";
import { WritingStyleSelector } from "@/components/story/writing-style-selector";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { WritingStyle } from "@/types/story";

export default function Home() {
  const { state, dispatch } = useStoryContext();
  const actions = useStoryActions();
  const [storyStyle, setStoryStyle] = useState<StoryStyle>("搞笑");
  const [panelCount, setPanelCount] = useState(4);
  const [previewTab, setPreviewTab] = useState<"cards" | "export">("cards");

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

  const handleGenerateStoryboard = () => {
    if (!state.story) return;
    actions.generateStoryboard(
      state.story.content,
      state.character,
      panelCount
    );
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

        {/* Step 2: Character */}
        {state.story && (
          <StepCard title="角色档案" step={2} badge="B7">
            <CharacterEditor
              character={state.character}
              onChange={actions.setCharacter}
              disabled={state.isGeneratingStoryboard}
            />
          </StepCard>
        )}

        {/* Step 3: Storyboard */}
        {state.story && (
          <StepCard title="分镜脚本" step={3} badge="B3">
            <div className="space-y-4">
              {!state.storyboard ? (
                <>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">分镜数量：</label>
                    {[3, 4, 5, 6, 8].map((n) => (
                      <button
                        key={n}
                        onClick={() => setPanelCount(n)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                          panelCount === n
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {n} 格
                      </button>
                    ))}
                  </div>

                  {state.storyboardError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {state.storyboardError}
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateStoryboard}
                    disabled={state.isGeneratingStoryboard}
                    className="w-full"
                    size="lg"
                  >
                    {state.isGeneratingStoryboard ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI 正在拆解分镜...
                      </>
                    ) : (
                      `生成 ${panelCount} 格分镜脚本`
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setPreviewTab("cards")}
                      className={`text-sm font-medium transition-colors ${
                        previewTab === "cards"
                          ? "text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      📋 卡片视图
                    </button>
                    <button
                      onClick={() => setPreviewTab("export")}
                      className={`text-sm font-medium transition-colors ${
                        previewTab === "export"
                          ? "text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      📄 源码导出
                    </button>
                    <span className="ml-auto text-xs text-gray-400">
                      {Object.keys(state.storyboard.panels).length} 个分镜
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateStoryboard}
                      disabled={state.isGeneratingStoryboard}
                    >
                      重新生成
                    </Button>
                  </div>

                  {previewTab === "cards" ? (
                    <PanelList
                      storyboard={state.storyboard}
                      onUpdatePanel={actions.updatePanel}
                    />
                  ) : (
                    <StoryboardPreview storyboard={state.storyboard} />
                  )}

                  <Separator />

                  <WritingStyleSelector
                    value={null}
                    onChange={(writingStyle: WritingStyle) =>
                      actions.restylePanels(
                        state.storyboard!.panels,
                        writingStyle
                      )
                    }
                    disabled={state.isRestyling}
                  />
                </div>
              )}
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
