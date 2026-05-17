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
import { PromptPreview } from "@/components/prompt/prompt-preview";
import { ExportPanel } from "@/components/export/export-panel";
import { StylePresetSelector } from "@/components/prompt/style-preset-selector";
import { HotspotPanel } from "@/components/hotspot/hotspot-panel";
import { PromptCard } from "@/components/prompt/prompt-card";
import { BatchExport } from "@/components/export/batch-export";
import { Button } from "@/components/ui/button";
import { WritingStyleSelector } from "@/components/story/writing-style-selector";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { WritingStyle } from "@/types/story";
import { getPanelKeys } from "@/types/storyboard";

export default function Home() {
  const { state, dispatch } = useStoryContext();
  const actions = useStoryActions();
  const [storyStyle, setStoryStyle] = useState<StoryStyle>("搞笑");
  const [panelCount, setPanelCount] = useState(4);
  const [previewTab, setPreviewTab] = useState<"cards" | "export">("cards");
  const [promptViewTab, setPromptViewTab] = useState<"cards" | "source" | "batch">("cards");
  const [externalTopic, setExternalTopic] = useState<string | null>(null);

  const handleGenerate = (topic: string) => {
    actions.generateStory(topic, storyStyle);
  };

  const handleExpand = (summary: string) => {
    actions.expandStory(summary, storyStyle);
  };

  const handleSelectAngle = (sampleTopic: string, style: string) => {
    setExternalTopic(sampleTopic);
    setStoryStyle(style as StoryStyle);
  };

  const handleTopicConsumed = () => {
    setExternalTopic(null);
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
        {/* Step 0: Hotspot Radar */}
        <StepCard title="热点雷达" step={0} badge="A1/A2">
          <HotspotPanel onSelectAngle={handleSelectAngle} />
        </StepCard>

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
              externalTopic={externalTopic}
              onTopicConsumed={handleTopicConsumed}
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

                  <StylePresetSelector
                    value={state.selectedPresetId}
                    onChange={(preset) =>
                      actions.applyPreset(
                        preset.style,
                        preset.colorScheme,
                        preset.backgroundStyle
                      )
                    }
                    disabled={state.isRestyling}
                  />

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

        {/* Step 4: Prompt Generation + Agent Export */}
        {state.storyboard && (
          <StepCard title="提示词生成 & 导出" step={4} badge="C1/C2">
            <div className="space-y-4">
              {/* C1: Generate Image Prompts */}
              {!state.structuredPrompt ? (
                <>
                  <p className="text-sm text-gray-500">
                    为每个分镜生成完整的 AI 生图提示词（image_prompt），融合角色外貌、风格、场景和动作描述
                  </p>
                  <Button
                    onClick={() =>
                      actions.generatePrompt(state.storyboard!)
                    }
                    disabled={state.isGeneratingPrompt}
                    className="w-full"
                    size="lg"
                  >
                    {state.isGeneratingPrompt ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        AI 正在生成生图提示词...
                      </>
                    ) : (
                      "生成生图提示词"
                    )}
                  </Button>
                  {state.promptError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {state.promptError}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {/* View tabs */}
                  <div className="flex items-center gap-2">
                    {([
                      { key: "cards", label: "💬 提示词卡片" },
                      { key: "source", label: "📄 源码导出" },
                      { key: "batch", label: "📦 批量导出" },
                    ] as const).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setPromptViewTab(tab.key)}
                        className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                          promptViewTab === tab.key
                            ? "bg-gray-900 text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {promptViewTab === "cards" && (
                    <div className="space-y-3">
                      {getPanelKeys(state.structuredPrompt!).map((key, i) => (
                        <PromptCard
                          key={key}
                          index={i}
                          label={`第 ${i + 1} 格 · ${state.structuredPrompt!.panels[key].description}`}
                          panel={state.structuredPrompt!.panels[key]}
                        />
                      ))}
                    </div>
                  )}

                  {promptViewTab === "source" && (
                    <>
                      <PromptPreview
                        prompt={state.structuredPrompt}
                        isLoading={false}
                        error={null}
                      />
                      <Separator />
                      <ExportPanel
                        prompt={state.structuredPrompt}
                        selectedAdapter={state.selectedAdapter}
                        onAdapterChange={actions.setAdapter}
                      />
                    </>
                  )}

                  {promptViewTab === "batch" && (
                    <BatchExport prompt={state.structuredPrompt} />
                  )}

                  {/* Always show adapter export in cards/batch view */}
                  {promptViewTab !== "source" && (
                    <>
                      <Separator />
                      <ExportPanel
                        prompt={state.structuredPrompt}
                        selectedAdapter={state.selectedAdapter}
                        onAdapterChange={actions.setAdapter}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </StepCard>
        )}
      </main>
    </div>
  );
}
