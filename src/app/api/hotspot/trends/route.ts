import { NextRequest, NextResponse } from "next/server";
import { fetchTrends } from "@/lib/services/hotspot-service";
import type { HotspotCategory } from "@/types/hotspot";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as HotspotCategory | null;

    const validCategories: HotspotCategory[] = [
      "情感", "职场", "育儿", "宠物", "社会", "科技", "娱乐", "生活",
    ];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "无效的分类" },
        { status: 400 }
      );
    }

    const trends = await fetchTrends(category || undefined);

    return NextResponse.json({ success: true, data: { trends } });
  } catch (error) {
    console.error("热点获取失败:", error);
    const message =
      error instanceof Error ? error.message : "AI 服务暂时不可用，请稍后重试";
    return NextResponse.json(
      { success: false, error: "AI_ERROR", message },
      { status: 503 }
    );
  }
}
