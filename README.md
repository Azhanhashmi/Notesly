# Notesly
A premium, minimal drag-and-drop page builder built with React, dnd-kit, and Tailwind CSS.

## Features

- **Three block types**: Heading (H1/H2/H3), Text paragraph, Image (URL + caption + alt)
- **Drag & drop reordering** via dnd-kit with smooth animations and drag overlay
- **Inline editing** — click any block to edit directly
- **Duplicate blocks** — one-click clone of any block
- **Delete blocks** with confirmation
- **Auto-save** to localStorage — persists across page refreshes
- **Clear all** with double-confirm safety check
- **Empty state** with quick-add shortcuts
- **Invalid image URL handling** with visual error state

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS v3 |
| Drag & Drop | dnd-kit (core + sortable + modifiers) |
| State | useReducer |
| Persistence | localStorage |
| Fonts | DM Sans, DM Mono, Syne (Google Fonts) |

## Project Structure

```
src/
  components/
    Sidebar.jsx        — Left panel with block-type buttons
    Canvas.jsx         — DnD context, sortable list, empty state
    BlockWrapper.jsx   — Drag handle, type label, delete/duplicate actions
    HeaderBlock.jsx    — Editable heading with H1/H2/H3 switcher
    TextBlock.jsx      — Auto-resizing textarea paragraph
    ImageBlock.jsx     — URL input, preview, alt text, caption
  hooks/
    useBlocks.js       — useReducer for all block CRUD + reorder
  utils/
    storage.js         — localStorage load/save/clear helpers
  App.jsx              — Root layout: sidebar + topbar + canvas
  main.jsx             — React entry point
```

## How It Works

1. **State** lives in `useBlocks` as `{ blocks: [...] }`, managed by `useReducer`
2. Every state change triggers a `useEffect` that calls `saveBlocks()` to localStorage
3. On mount, `loadBlocks()` hydrates initial state from storage
4. `Canvas.jsx` wraps blocks in `DndContext` + `SortableContext`; each `BlockWrapper` uses `useSortable`
5. On drag end, `arrayMove` reorders the array and dispatches `REORDER_BLOCKS`
6. Each block type component receives `content` + `onChange` — it's purely controlled

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npm run build
# drag the dist/ folder to vercel.com/new, or:
npx vercel --prod
```
