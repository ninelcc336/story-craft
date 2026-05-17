import { NextRequest, NextResponse } from "next/server";
import { restyleStoryboard } from "@/lib/services/storyboard-service";
import { getApiKeyFromRequest, getModelFromRequest, getBaseUrlFromRequest } from "@/lib/utils/server-cookies";
import type { WritingStyle } from "@/types/story";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { panels, writingStyle } = body as {
      panels: Record<string, { text: string }>;
      writingStyle: WritingStyle;
    };

    if (!panels || typeof panels !== "object" || Object.keys(panels).length === 0) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "分镜数据不能为空" },
        { status: 400 }
      );
    }

    const validStyles: WritingStyle[] = ["口语化", "文学化", "网感化", "治愈系"];
    if (!writingStyle || !validStyles.includes(writingStyle)) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "无效的风格" },
        { status: 400 }
      );
    }

    const result = await restyleStoryboard(
      { panels, writingStyle },
      getApiKeyFromRequest(request),
      getModelFromRequest(request),
      getBaseUrlFromRequest(request)
    );

    return NextResponse.json({ success: true, data: { panels: result } });
  } catch (error) {
    console.error("风格切换失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
