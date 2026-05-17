export type AdapterId =
  | "doubao"
  | "qianwen"
  | "wanxiang"
  | "jimeng"
  | "keling"
  | "gptimage"
  | "nanobanana";

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
    id: "doubao",
    name: "豆包",
    description: "适用于字节豆包的中文生图提示词",
  },
  {
    id: "qianwen",
    name: "千文",
    description: "适用于千文 (通义千问) 的中文生图提示词",
  },
  {
    id: "wanxiang",
    name: "万相",
    description: "适用于阿里万相的中文生图提示词",
  },
  {
    id: "jimeng",
    name: "即梦",
    description: "适用于字节即梦 AI 的中文生图提示词",
  },
  {
    id: "keling",
    name: "可灵",
    description: "适用于快手可灵的中文生图提示词",
  },
  {
    id: "gptimage",
    name: "Gpt-image-2",
    description: "适用于 OpenAI GPT Image 2 的生图提示词",
  },
];
