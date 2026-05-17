import { NextRequest, NextResponse } from "next/server";
import { generateStoryboard } from "@/lib/services/storyboard-service";
import type { Character } from "@/types/character";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { story, character, panelCount } = body as {
      story: string;
      character: Character;
      panelCount: number;
    };

    if (!story || typeof story !== "string" || story.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "故事内容过短（至少50字）",
        },
        { status: 400 }
      );
    }

    const count =
      typeof panelCount === "number" && panelCount >= 3 && panelCount <= 8
        ? panelCount
        : 4;

    const storyboard = await generateStoryboard({
      story: story.trim(),
      character: character || { name: "", appearance: "", personality: "" },
      panelCount: count,
    });

    return NextResponse.json({ success: true, data: { storyboard } });
  } catch (error) {
    console.error("分镜生成失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
