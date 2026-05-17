"use client";

import { useState } from "react";
import { useStoryContext, useStoryActions } from "@/lib/store/story-context";
import { hasValidApiKey } from "@/lib/store/settings-store";
import type { StoryStyle } from "@/types/story";
import { Header } from "@/components/layout/header";
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
import { Loader2, Sparkles, BookOpen, User, Layout, Download } from "lucide-react";
import type { WritingStyle } from "@/types/story";
import { getPanelKeys } from "@/types/storyboard";

const STEPS = [
  { id: "hotspot", label: "热点", icon: Sparkles, num: 0 },
  { id: "story", label: "故事", icon: BookOpen, num: 1 },
  { id: "character", label: "角色", icon: User, num: 2 },
  { id: "storyboard", label: "分镜", icon: Layout, num: 3 },
  { id: "export", label: "导出", icon: Download, num: 4 },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function Home() {
  const { state, dispatch } = useStoryContext();
  const actions = useStoryActions();
  const [activeStep, setActiveStep] = useState<StepId>("hotspot");
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
    setActiveStep("story");
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
    actions.generateStoryboard(state.story.content, state.character, panelCount);
  };

  const isStepComplete = (step: StepId): boolean => {
    switch (step) {
      case "hotspot": return true; // always available
      case "story": return !!state.story;
      case "character": return !!state.story;
      case "storyboard": return !!state.storyboard;
      case "export": return !!state.structuredPrompt;
    }
  };

  const isStepAvailable = (step: StepId): boolean => {
    if (step === "hotspot" || step === "story") return true;
    return !!state.story;
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
      <Header onReset={actions.reset} />

      {/* No API Key Warning */}
      {!hasValidApiKey() && (
        <div className="shrink-0 border-b border-amber-200 bg-amber-50 px-6 py-2.5">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <p className="text-sm text-amber-800">
              ⚠️ 尚未配置 LLM API Key，请点击右上角齿轮图标{" "}
              <span className="font-medium">⚙</span> 进行配置后使用 AI 功能
            </p>
            <button
              onClick={() => {
                const btn = document.querySelector('[title="LLM 配置"]') as HTMLButtonElement;
                btn?.click();
              }}
              className="shrink-0 rounded bg-amber-200 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-300"
            >
              去配置
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="shrink-0 border-b border-gray-200 bg-white px-6">
        <div className="mx-auto flex max-w-4xl gap-1">
          {STEPS.map((step) => {
            const available = isStepAvailable(step.id);
            const complete = isStepComplete(step.id);
            const active = activeStep === step.id;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                disabled={!available}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "border-gray-900 text-gray-900"
                    : available
                    ? "border-transparent text-gray-500 hover:text-gray-700"
                    : "border-transparent text-gray-300 cursor-not-allowed"
                }`}
              >
                <Icon className="h-4 w-4" />
                {step.label}
                {complete && (
                  <span className="ml-1 text-xs text-green-500">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Step Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6">
          {/* Hotspot */}
          {activeStep === "hotspot" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Sparkles className="h-5 w-5" /> 热点雷达
              </h2>
              <HotspotPanel onSelectAngle={handleSelectAngle} />
            </div>
          )}

          {/* Story */}
          {activeStep === "story" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <BookOpen className="h-5 w-5" /> 故事生成
              </h2>
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
              {state.story && (
                <StoryDisplay
                  story={state.story}
                  isLoading={false}
                  error={null}
                  onContentChange={handleContentChange}
                />
              )}
              {!state.story && (
                <StoryDisplay
                  story={null}
                  isLoading={state.isGeneratingStory || state.isExpanding}
                  error={state.storyError}
                />
              )}
            </div>
          )}

          {/* Character */}
          {activeStep === "character" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5" /> 角色档案
              </h2>
              <CharacterEditor
                character={state.character}
                onChange={actions.setCharacter}
                disabled={state.isGeneratingStoryboard}
              />
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setActiveStep("story")}>
                  ← 上一步
                </Button>
                <Button size="sm" onClick={() => setActiveStep("storyboard")}>
                  下一步 →
                </Button>
              </div>
            </div>
          )}

          {/* Storyboard */}
          {activeStep === "storyboard" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Layout className="h-5 w-5" /> 分镜脚本
              </h2>

              {!state.storyboard ? (
                <div className="space-y-4">
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
                </div>
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
                    <PanelList storyboard={state.storyboard} onUpdatePanel={actions.updatePanel} />
                  ) : (
                    <StoryboardPreview storyboard={state.storyboard} />
                  )}

                  <Separator />
                  <StylePresetSelector
                    value={state.selectedPresetId}
                    onChange={(preset) =>
                      actions.applyPreset(preset.id, preset.style, preset.colorScheme, preset.backgroundStyle)
                    }
                    disabled={state.isRestyling}
                  />
                  <Separator />
                  <WritingStyleSelector
                    value={null}
                    onChange={(writingStyle: WritingStyle) =>
                      actions.restylePanels(state.storyboard!.panels, writingStyle)
                    }
                    disabled={state.isRestyling}
                  />

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setActiveStep("character")}>
                      ← 上一步
                    </Button>
                    <Button size="sm" onClick={() => setActiveStep("export")}>
                      下一步 →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export */}
          {activeStep === "export" && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Download className="h-5 w-5" /> 提示词生成 & 导出
              </h2>

              {!state.structuredPrompt ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    为每个分镜生成完整的 AI 生图提示词（image_prompt），融合角色外貌、风格、场景和动作描述
                  </p>
                  <Button
                    onClick={() => actions.generatePrompt(state.storyboard!)}
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
                </div>
              ) : (
                <div className="space-y-4">
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
                      <PromptPreview prompt={state.structuredPrompt} isLoading={false} error={null} />
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

              {state.structuredPrompt && (
                <div className="flex justify-start pt-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveStep("storyboard")}>
                    ← 上一步
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
