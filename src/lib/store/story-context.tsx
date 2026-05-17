"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type { Story, StoryStyle, WritingStyle } from "@/types/story";
import type { Character } from "@/types/character";
import type { StoryboardScript } from "@/types/storyboard";
import type { AdapterId } from "@/types/adapter";
import { loadWorkspace, saveWorkspace, clearWorkspace } from "./storage-utils";

interface WorkspaceState {
  story: Story | null;
  isGeneratingStory: boolean;
  storyError: string | null;
  isExpanding: boolean;
  character: Character;
  storyboard: StoryboardScript | null;
  isGeneratingStoryboard: boolean;
  storyboardError: string | null;
  isRestyling: boolean;
  structuredPrompt: StoryboardScript | null;
  isGeneratingPrompt: boolean;
  promptError: string | null;
  selectedAdapter: AdapterId;
  adaptedOutput: string | null;
  selectedPresetId: string | null;
}

const initialState: WorkspaceState = {
  story: null,
  isGeneratingStory: false,
  storyError: null,
  isExpanding: false,
  character: { name: "", appearance: "", personality: "" },
  storyboard: null,
  isGeneratingStoryboard: false,
  storyboardError: null,
  isRestyling: false,
  structuredPrompt: null,
  isGeneratingPrompt: false,
  promptError: null,
  selectedAdapter: "nanobanana",
  adaptedOutput: null,
  selectedPresetId: null,
};

type Action =
  | { type: "SET_STORY"; payload: Story }
  | { type: "SET_STORY_LOADING"; payload: boolean }
  | { type: "SET_STORY_ERROR"; payload: string | null }
  | { type: "SET_EXPANDING"; payload: boolean }
  | { type: "SET_CHARACTER"; payload: Character }
  | { type: "SET_STORYBOARD"; payload: StoryboardScript }
  | { type: "SET_STORYBOARD_LOADING"; payload: boolean }
  | { type: "SET_STORYBOARD_ERROR"; payload: string | null }
  | { type: "UPDATE_PANEL"; payload: { key: string; field: string; value: string } }
  | { type: "SET_RESTYLING"; payload: boolean }
  | { type: "RESTYLE_PANELS"; payload: Record<string, { text: string }> }
  | { type: "SET_PROMPT"; payload: StoryboardScript }
  | { type: "SET_PROMPT_LOADING"; payload: boolean }
  | { type: "SET_PROMPT_ERROR"; payload: string | null }
  | { type: "SET_ADAPTER"; payload: AdapterId }
  | { type: "SET_ADAPTED_OUTPUT"; payload: string | null }
  | { type: "APPLY_PRESET"; payload: { presetId: string; style: string; colorScheme: string; backgroundStyle: string } }
  | { type: "LOAD_STATE"; payload: WorkspaceState }
  | { type: "RESET" };

function workspaceReducer(
  state: WorkspaceState,
  action: Action
): WorkspaceState {
  switch (action.type) {
    case "SET_STORY":
      return { ...state, story: action.payload, storyError: null };
    case "SET_STORY_LOADING":
      return { ...state, isGeneratingStory: action.payload };
    case "SET_STORY_ERROR":
      return { ...state, storyError: action.payload };
    case "SET_EXPANDING":
      return { ...state, isExpanding: action.payload };
    case "SET_CHARACTER":
      return { ...state, character: action.payload };
    case "SET_STORYBOARD":
      return { ...state, storyboard: action.payload, storyboardError: null };
    case "SET_STORYBOARD_LOADING":
      return { ...state, isGeneratingStoryboard: action.payload };
    case "SET_STORYBOARD_ERROR":
      return { ...state, storyboardError: action.payload };
    case "UPDATE_PANEL": {
      if (!state.storyboard) return state;
      const panels = { ...state.storyboard.panels };
      const panel = { ...panels[action.payload.key] };
      (panel as Record<string, string>)[action.payload.field] =
        action.payload.value;
      panels[action.payload.key] = panel;
      return {
        ...state,
        storyboard: { ...state.storyboard, panels },
      };
    }
    case "SET_RESTYLING":
      return { ...state, isRestyling: action.payload };
    case "RESTYLE_PANELS": {
      if (!state.storyboard) return state;
      const updatedPanels = { ...state.storyboard.panels };
      for (const [key, data] of Object.entries(action.payload)) {
        if (updatedPanels[key]) {
          updatedPanels[key] = { ...updatedPanels[key], text: data.text };
        }
      }
      return {
        ...state,
        storyboard: { ...state.storyboard, panels: updatedPanels },
      };
    }
    case "SET_PROMPT":
      return { ...state, structuredPrompt: action.payload, promptError: null };
    case "SET_PROMPT_LOADING":
      return { ...state, isGeneratingPrompt: action.payload };
    case "SET_PROMPT_ERROR":
      return { ...state, promptError: action.payload };
    case "SET_ADAPTER":
      return { ...state, selectedAdapter: action.payload, adaptedOutput: null };
    case "SET_ADAPTED_OUTPUT":
      return { ...state, adaptedOutput: action.payload };
    case "APPLY_PRESET": {
      const { presetId, style, colorScheme, backgroundStyle } = action.payload;
      if (!state.storyboard) {
        // 分镜尚未生成，先记住预设选择，后续生成时自动应用
        return { ...state, selectedPresetId: presetId };
      }
      return {
        ...state,
        selectedPresetId: presetId,
        storyboard: {
          ...state.storyboard,
          comic_info: {
            ...state.storyboard.comic_info,
            style,
            color_scheme: colorScheme,
            background_style: backgroundStyle,
          },
        },
      };
    }
    case "LOAD_STATE":
      return { ...action.payload };
    case "RESET":
      clearWorkspace();
      return { ...initialState };
    default:
      return state;
  }
}

interface StoryContextValue {
  state: WorkspaceState;
  dispatch: React.Dispatch<Action>;
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  useEffect(() => {
    const saved = loadWorkspace<WorkspaceState>();
    if (saved) {
      dispatch({ type: "LOAD_STATE", payload: { ...initialState, ...saved } });
    }
  }, []);

  useEffect(() => {
    saveWorkspace(state);
  }, [state]);

  return (
    <StoryContext.Provider value={{ state, dispatch }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStoryContext() {
  const ctx = useContext(StoryContext);
  if (!ctx)
    throw new Error("useStoryContext must be used within StoryProvider");
  return ctx;
}

export function useStoryActions() {
  const { dispatch } = useStoryContext();

  const generateStory = useCallback(
    async (topic: string, style: StoryStyle, wordCount?: number) => {
      dispatch({ type: "SET_STORY_LOADING", payload: true });
      dispatch({ type: "SET_STORY_ERROR", payload: null });
      try {
        const res = await fetch("/api/story/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, style, wordCount }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message || "故事生成失败");
        }
        dispatch({ type: "SET_STORY", payload: json.data.story });
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "AI 服务暂时不可用，请稍后重试";
        dispatch({ type: "SET_STORY_ERROR", payload: msg });
      } finally {
        dispatch({ type: "SET_STORY_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const expandStory = useCallback(
    async (summary: string, style: StoryStyle, wordCount?: number) => {
      dispatch({ type: "SET_EXPANDING", payload: true });
      dispatch({ type: "SET_STORY_ERROR", payload: null });
      try {
        const res = await fetch("/api/story/expand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary, style, wordCount }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message || "故事扩展失败");
        }
        dispatch({ type: "SET_STORY", payload: json.data.story });
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "AI 服务暂时不可用，请稍后重试";
        dispatch({ type: "SET_STORY_ERROR", payload: msg });
      } finally {
        dispatch({ type: "SET_EXPANDING", payload: false });
      }
    },
    [dispatch]
  );

  const setCharacter = useCallback(
    (character: Character) => {
      dispatch({ type: "SET_CHARACTER", payload: character });
    },
    [dispatch]
  );

  const generateStoryboard = useCallback(
    async (story: string, character: Character, panelCount: number) => {
      dispatch({ type: "SET_STORYBOARD_LOADING", payload: true });
      dispatch({ type: "SET_STORYBOARD_ERROR", payload: null });
      try {
        const res = await fetch("/api/storyboard/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story, character, panelCount }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message || "分镜生成失败");
        }
        dispatch({ type: "SET_STORYBOARD", payload: json.data.storyboard });
        if (json.data.storyboard.comic_info?.character) {
          dispatch({
            type: "SET_CHARACTER",
            payload: json.data.storyboard.comic_info.character,
          });
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "AI 服务暂时不可用，请稍后重试";
        dispatch({ type: "SET_STORYBOARD_ERROR", payload: msg });
      } finally {
        dispatch({ type: "SET_STORYBOARD_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const updatePanel = useCallback(
    (key: string, field: string, value: string) => {
      dispatch({ type: "UPDATE_PANEL", payload: { key, field, value } });
    },
    [dispatch]
  );

  const restylePanels = useCallback(
    async (panels: Record<string, { text: string }>, writingStyle: WritingStyle) => {
      dispatch({ type: "SET_RESTYLING", payload: true });
      try {
        const panelTexts: Record<string, { text: string }> = {};
        for (const [key, panel] of Object.entries(panels)) {
          panelTexts[key] = { text: panel.text };
        }
        const res = await fetch("/api/storyboard/restyle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ panels: panelTexts, writingStyle }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            dispatch({
              type: "RESTYLE_PANELS",
              payload: json.data.panels,
            });
          }
        }
      } catch {
        // silent fail for restyle
      } finally {
        dispatch({ type: "SET_RESTYLING", payload: false });
      }
    },
    [dispatch]
  );

  const generatePrompt = useCallback(
    async (storyboard: StoryboardScript) => {
      dispatch({ type: "SET_PROMPT_LOADING", payload: true });
      dispatch({ type: "SET_PROMPT_ERROR", payload: null });
      try {
        const res = await fetch("/api/prompt/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storyboard }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message || "提示词生成失败");
        }
        dispatch({ type: "SET_PROMPT", payload: json.data.prompt });
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "AI 服务暂时不可用，请稍后重试";
        dispatch({ type: "SET_PROMPT_ERROR", payload: msg });
      } finally {
        dispatch({ type: "SET_PROMPT_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const setAdapter = useCallback(
    (adapter: AdapterId) => {
      dispatch({ type: "SET_ADAPTER", payload: adapter });
    },
    [dispatch]
  );

  const setAdaptedOutput = useCallback(
    (output: string | null) => {
      dispatch({ type: "SET_ADAPTED_OUTPUT", payload: output });
    },
    [dispatch]
  );

  const applyPreset = useCallback(
    (presetId: string, style: string, colorScheme: string, backgroundStyle: string) => {
      dispatch({
        type: "APPLY_PRESET",
        payload: { presetId, style, colorScheme, backgroundStyle },
      });
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, [dispatch]);

  return {
    generateStory,
    expandStory,
    setCharacter,
    generateStoryboard,
    updatePanel,
    restylePanels,
    generatePrompt,
    setAdapter,
    setAdaptedOutput,
    applyPreset,
    reset,
  };
}
