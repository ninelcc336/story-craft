import type { StoryStyle, Story } from "@/types/story";

export function buildStoryPrompt(params: {
  topic: string;
  style: StoryStyle;
  wordCount?: number;
}): string {
  const { topic, style, wordCount = 600 } = params;

  const styleGuides: Record<StoryStyle, string> = {
    温情: "温馨感人，以亲情、友情或爱情为主题，结局温暖人心",
    悬疑: "设置悬念，层层递进，在结尾留下反转或意外",
    搞笑: "轻松幽默，对话诙谐，情节出人意料，令人会心一笑",
    治愈: "舒缓温和，如春风般抚慰心灵，画面感强，情绪细腻",
    励志: "积极向上，主角克服困难实现目标，鼓舞人心",
  };

  return `请根据以下主题创作一个${style}风格的短篇故事。

【主题】${topic}
【风格要求】${styleGuides[style]}
【字数范围】${wordCount}字左右
【重要】请输出纯故事文本，不要包含任何分析、说明或额外标记。

故事正文：`;
}

export function parseStoryResponse(
  raw: string,
  params: { topic: string; style: StoryStyle }
): Story {
  const content = raw.trim();
  if (!content || content.length < 50) {
    throw new Error("AI 生成的故事内容过短，请重试");
  }
  return {
    content,
    title: params.topic,
    style: params.style,
    wordCount: content.length,
  };
}

export function buildExpandPrompt(params: {
  summary: string;
  style: StoryStyle;
  wordCount?: number;
}): string {
  const { summary, style, wordCount = 600 } = params;

  const styleGuides: Record<StoryStyle, string> = {
    温情: "温馨感人，以亲情、友情或爱情为主题，结局温暖人心",
    悬疑: "设置悬念，层层递进，在结尾留下反转或意外",
    搞笑: "轻松幽默，对话诙谐，情节出人意料，令人会心一笑",
    治愈: "舒缓温和，如春风般抚慰心灵，画面感强，情绪细腻",
    励志: "积极向上，主角克服困难实现目标，鼓舞人心",
  };

  return `请将以下一句话故事梗概扩展为一篇完整的${style}风格短篇故事。

【故事梗概】${summary}
【风格要求】${styleGuides[style]}
【字数范围】${wordCount}字左右
【重要】请输出纯故事文本，不要包含任何分析、说明或额外标记。

故事正文：`;
}
