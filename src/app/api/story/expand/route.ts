import { NextRequest, NextResponse } from "next/server";
import { expandStory } from "@/lib/services/story-service";
import type { StoryStyle } from "@/types/story";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, style, wordCount } = body as {
      summary: string;
      style: StoryStyle;
      wordCount?: number;
    };

    if (
      !summary ||
      typeof summary !== "string" ||
      summary.trim().length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "故事梗概不能为空",
        },
        { status: 400 }
      );
    }

    const validStyles: StoryStyle[] = ["温情", "悬疑", "搞笑", "治愈", "励志"];
    if (!style || !validStyles.includes(style)) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "请选择有效的故事风格",
        },
        { status: 400 }
      );
    }

    const story = await expandStory({
      summary: summary.trim(),
      style,
      wordCount: wordCount || 600,
    });

    return NextResponse.json({ success: true, data: { story } });
  } catch (error) {
    console.error("故事扩展失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
