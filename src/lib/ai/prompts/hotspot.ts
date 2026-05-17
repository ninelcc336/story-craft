import type { HotTopic, StoryAngle } from "@/types/hotspot";
import type { StoryStyle } from "@/types/story";
import * as yaml from "js-yaml";

function today(): string {
  return new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildTrendsPrompt(category?: string): string {
  const categoryFilter = category ? `【指定领域】${category}` : "【领域】涵盖情感、职场、育儿、宠物、社会、科技、娱乐、生活等多个领域";
  return `请以一名资深自媒体内容策划的身份，列出今天（${today()}）适合做故事化创作的 10 个热门话题。

${categoryFilter}

【输出要求】
请严格按照以下 YAML 格式输出，不要有任何额外的解释文字：

\`\`\`yaml
trends:
  - id: "trend-1"
    title: "热点标题（抓人眼球）"
    summary: "30字以内的热点简述"
    category: "情感"
    heat: 4
    phase: "爆发期"
    source: "微博热搜"
  - id: "trend-2"
    ...
\`\`\`

【重要规则】
1. heat 为 1-5 的整数，代表热度
2. phase 只能是 萌芽期 / 爆发期 / 衰退期
3. category 只能是 情感 / 职场 / 育儿 / 宠物 / 社会 / 科技 / 娱乐 / 生活
4. 每个热点要适合做短视频图文故事创作
5. 只输出 YAML 代码块，不要任何额外文字`;
}

export function buildAnglesPrompt(topic: HotTopic): string {
  return `请以一名资深故事策划的身份，为以下热点话题推荐 4 个故事切入角度，每个角度都可以写成一篇吸引人的短篇故事。

【热点话题】
- 标题：${topic.title}
- 简述：${topic.summary}
- 分类：${topic.category}
- 热度：${"🔥".repeat(topic.heat)}
- 阶段：${topic.phase}
- 来源：${topic.source}

【输出要求】
请严格按照以下 YAML 格式输出：

\`\`\`yaml
angles:
  - id: "angle-1"
    angle: "切入角度描述（如：逆袭故事 / 温情和解 / 反讽吐槽）"
    suggestedStyle: "搞笑"
    sampleTopic: "可直接用于故事生成的具体主题（20字以内）"
    rationale: "为什么这个角度适合该热点（1句话）"
  - id: "angle-2"
    ...
\`\`\`

【重要规则】
1. suggestedStyle 只能是 温情 / 悬疑 / 搞笑 / 治愈 / 励志
2. 4 个角度要有差异化，覆盖不同情绪和受众
3. 每个 sampleTopic 要可以直接复制作为故事生成的主题
4. 只输出 YAML 代码块，不要任何额外文字`;
}

export function parseTrendsResponse(raw: string): HotTopic[] {
  const yamlMatch = raw.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/);
  const yamlStr = yamlMatch ? yamlMatch[1].trim() : raw.trim();

  let parsed: unknown;
  try {
    parsed = yaml.load(yamlStr);
  } catch {
    throw new Error("AI 返回的热点数据格式无效，请重试");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("热点数据解析失败");
  }

  const data = parsed as Record<string, unknown>;
  const trends = data.trends as unknown[] | undefined;
  if (!trends || !Array.isArray(trends) || trends.length === 0) {
    throw new Error("未获取到有效的热点列表");
  }

  return trends.slice(0, 10) as HotTopic[];
}

export function parseAnglesResponse(raw: string): StoryAngle[] {
  const yamlMatch = raw.match(/```(?:yaml|yml)?\s*([\s\S]*?)```/);
  const yamlStr = yamlMatch ? yamlMatch[1].trim() : raw.trim();

  let parsed: unknown;
  try {
    parsed = yaml.load(yamlStr);
  } catch {
    throw new Error("AI 返回的角度数据格式无效，请重试");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("角度数据解析失败");
  }

  const data = parsed as Record<string, unknown>;
  const angles = data.angles as unknown[] | undefined;
  if (!angles || !Array.isArray(angles) || angles.length === 0) {
    throw new Error("未获取到有效的故事角度");
  }

  return angles.slice(0, 5) as StoryAngle[];
}
