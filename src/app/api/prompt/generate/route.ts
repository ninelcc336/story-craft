import { NextRequest, NextResponse } from "next/server";
import { generatePromptImages } from "@/lib/services/prompt-service";
import { getApiKeyFromRequest, getModelFromRequest, getBaseUrlFromRequest } from "@/lib/utils/server-cookies";
import type { StoryboardScript } from "@/types/storyboard";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyboard } = body as { storyboard: StoryboardScript };

    if (
      !storyboard ||
      !storyboard.panels ||
      Object.keys(storyboard.panels).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "分镜脚本数据无效",
        },
        { status: 400 }
      );
    }

    const prompt = await generatePromptImages(
      storyboard,
      getApiKeyFromRequest(request),
      getModelFromRequest(request),
      getBaseUrlFromRequest(request)
    );

    return NextResponse.json({ success: true, data: { prompt } });
  } catch (error) {
    console.error("提示词生成失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
