import { NextRequest, NextResponse } from "next/server";
import { recommendAngles } from "@/lib/services/hotspot-service";
import { getApiKeyFromRequest, getModelFromRequest } from "@/lib/utils/server-cookies";
import type { HotTopic } from "@/types/hotspot";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body as { topic: HotTopic };

    if (!topic || !topic.title || !topic.category) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "热点数据不完整",
        },
        { status: 400 }
      );
    }

    const angles = await recommendAngles(
      topic,
      getApiKeyFromRequest(request),
      getModelFromRequest(request)
    );

    return NextResponse.json({ success: true, data: { angles } });
  } catch (error) {
    console.error("角度推荐失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
