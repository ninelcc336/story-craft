# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StoryCraft AI（故事工坊）is an internal tool for AI-powered story/image creation. It generates structured storyboard scripts (YAML/JSON) for feeding into various AI image generation tools (豆包, Nano Banana, 即梦, 可灵, etc.).

**Tech Stack**: Next.js 14 App Router, TypeScript strict, Tailwind CSS 3, custom UI components (shadcn-style), Anthropic Claude API.

## Commands

```bash
npm run dev      # Start dev server (default port 3000)
npm run build    # Type-check + production build
npm run lint     # ESLint
```

## Architecture

### Pipeline (5-step Tab navigation)

```
热点雷达 → 故事生成 → 角色档案 → 分镜脚本 → 提示词导出
```

State flows through React Context (`src/lib/store/story-context.tsx`) with useReducer + localStorage persistence. Each step produces data consumed by the next.

### AI Client (`src/lib/ai/`)

- Factory: `createAIClient(apiKey?, model?, baseUrl?)` returns `AIProvider`
- Default provider: `ClaudeProvider` using `@anthropic-ai/sdk`
- All service functions accept optional `apiKey`, `model`, `baseUrl` params
- API routes read credentials from cookies (`storycraft_api_key`, etc.) via `src/lib/utils/server-cookies.ts`, falling back to `process.env.ANTHROPIC_API_KEY`
- User configures credentials in the UI (gear icon → SettingsDialog), stored in localStorage + cookies

### API Routes (11 endpoints)

| Route | Purpose |
|-------|---------|
| `GET /api/hotspot/trends` | AI generates trending topics list |
| `POST /api/hotspot/angles` | AI recommends 3-5 story angles for a topic |
| `POST /api/story/generate` | Generate story from topic + style |
| `POST /api/story/expand` | Expand one-sentence summary to full story |
| `POST /api/storyboard/generate` | Break story into panels with YAML structure |
| `POST /api/storyboard/restyle` | Rewrite panel text in different writing style |
| `POST /api/prompt/generate` | Generate image_prompt + negative_prompt + tech_params per panel |
| `GET /api/prompt/styles` | Return 20 visual style presets |
| `POST /api/adapt` | Convert prompts to tool-specific format |

Every route returns `{ success: true, data: T }` or `{ success: false, error: string, message: string }`.

### Key Patterns

- **Adapter Registry** (`src/lib/adapters/registry.ts`): Pluggable pattern for converting prompts to tool-specific formats. Add new adapters by calling `registerAdapter()` and importing in `index.ts`. Current: doubao, qianwen, wanxiang, jimeng, keling, gptimage, nanobanana.
- **Services** (`src/lib/services/`): Business logic layer between API routes and AI client. All AI calls have 2-3 retries with exponential backoff.
- **YAML as data format**: Storyboard scripts use YAML internally (via `js-yaml`). AI is prompted to respond in YAML code blocks with strict structure validation.
- **localStorage persistence**: Workspace state auto-saves. Settings (API key, provider, model, baseUrl) are separate.

### Custom UI Components

`src/components/ui/` contains hand-written shadcn-style components (Button, Card, Input, Textarea, Badge, Tabs, Separator) using Tailwind + `cn()` utility. No external UI library.
