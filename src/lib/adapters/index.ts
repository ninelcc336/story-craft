import "./nanobanana";
import "./gemini";
import "./dalle";
import "./doubao";

export { registerAdapter, getAdapter, listAdapters, adaptPrompt } from "./registry";
export type { AgentAdapter } from "./registry";
