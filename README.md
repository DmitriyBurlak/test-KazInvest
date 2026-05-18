# Test Chat (тестовое)

Веб-чат на **Nuxt 4** + **Nuxt UI** + **Comark** (Markdown в ответах ассистента). Одна страница `/` — диалог с ИИ через backend-прокси **OpenRouter** (Nitro, `server/`).

- **Структура** — ориентир FSD: `features`, `widgets`, `pages`, `shared`; серверная часть в `server/`.
- **Голосовой ввод** — Web Speech API (`features/voice-input`), с fallback для неподдерживаемых браузеров.
- **Отправка** — пока ждётся ответ, поле ввода активно; кнопка отправки и Enter заблокированы (`canSend` в `useChat`).

## Переменные окружения

Скопируйте `.env.example` → `.env` и укажите ключ OpenRouter:

```bash
NUXT_OPENROUTER_API_KEY=sk-or-v1-...
NUXT_OPENROUTER_MODEL=openai/gpt-4o-mini
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

## Запуск

```bash
pnpm install
pnpm dev
```

Откроется `http://localhost:3000`.

## Сборка

```bash
pnpm build
pnpm preview
```

## Проверки

```bash
pnpm lint
pnpm typecheck
```
