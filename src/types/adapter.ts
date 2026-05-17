export type AdapterId = "gemini" | "dalle" | "doubao" | "nanobanana";

export interface AgentAdapterDef {
  id: AdapterId;
  name: string;
  description: string;
}

export const ADAPTER_LIST: AgentAdapterDef[] = [
  {
    id: "nanobanana",
    name: "Nano Banana",
    description: "Nano Banana Pro 可用的结构化文本格式",
  },
  {
    id: "gemini",
    name: "Gemini Imagen",
    description: "适用于 Google Gemini 生图模型的提示词",
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    description: "适用于 OpenAI DALL-E 3 的英文提示词",
  },
  {
    id: "doubao",
    name: "豆包 / 即梦",
    description: "适用于字节豆包/即梦 AI 的中文提示词",
  },
];
