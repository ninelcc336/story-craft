import { NextResponse } from "next/server";
import { STYLE_PRESETS } from "@/lib/presets/styles";

export async function GET() {
  return NextResponse.json({ success: true, data: { styles: STYLE_PRESETS } });
}
