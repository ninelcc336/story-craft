import { NextRequest, NextResponse } from "next/server";
import { adaptPrompt } from "@/lib/adapters/index";
import type { StoryboardScript } from "@/types/storyboard";
import type { AdapterId } from "@/types/adapter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, adapter } = body as {
      prompt: StoryboardScript;
      adapter: AdapterId;
    };

    if (!prompt || !prompt.panels) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "提示词数据无效",
        },
        { status: 400 }
      );
    }

    const validAdapters: AdapterId[] = [
      "doubao",
      "qianwen",
      "wanxiang",
      "jimeng",
      "keling",
      "gptimage",
      "nanobanana",
    ];
    if (!adapter || !validAdapters.includes(adapter)) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "无效的适配器" },
        { status: 400 }
      );
    }

    const result = adaptPrompt(prompt, adapter);

    return NextResponse.json({
      success: true,
      data: { result, format: "text/plain" },
    });
  } catch (error) {
    console.error("适配器处理失败:", error);
    const message =
      error instanceof Error ? error.message : "适配器处理失败";
    return NextResponse.json(
      { success: false, error: "ADAPTER_ERROR", message },
      { status: 500 }
    );
  }
}
