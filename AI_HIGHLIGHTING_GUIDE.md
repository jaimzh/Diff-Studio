# AI Highlighting & Interactive Badges System

This document explains the architecture and implementation of the "Smart Highlighting" system added to Diff Studio.

## 1. Context Generation (`aiService.ts`)
To make the AI accurate with line numbers, we changed how the code is presented to the model.
- **Line Numbers**: The `getWorkspaceContext` function now maps every line of code to include its index (e.g., `1: const x = 0`).
- **Strict Instructions**: The system prompt was updated to enforce the `[[side|line X-Y]]` syntax, explaining that these tags become interactive buttons in the UI.
- **Model Upgrade**: Switched to `gpt-4o` for superior reasoning and more precise line referencing.

## 2. Token Parsing & Scroll Control (`highlightParser.ts`)
This utility handles the conversion of AI-generated tags into usable UI elements.
- **HTTPS Protocol**: We switched the internal link format from `highlight://` to `https://highlight.me/`. This tricks the markdown renderer into treating it as a safe link, avoiding "blocked" icons.
- **Jitter Prevention**: While streaming, the AI repeats the same content. To prevent the editor from constantly jumping back to line 1, we added a primitive "last scroll" tracker (`_lastScrollRequest`). The editor only auto-scrolls when a *different* line or side is mentioned for the first time in a turn.

## 3. Interactive Badges (`message.tsx`)
The chat interface now intercepts specific links to render them as UI components.
- **Custom Link Component**: inside the `Streamdown` renderer, we override the default `<a>` tag.
- **Interactive Buttons**: If a link matches our custom highlight protocol, it renders a styled indigo (left) or emerald (right) badge.
- **On Click Logic**:
    - `requestScroll(side, line)`: Tells the Monaco editor to teleport to that line.
    - `setHighlights(...)`: Re-paints the visual background highlight in the editor.

## 4. Global State & Sync (`WorkspaceStore.ts`)
Zustand acts as the bridge between the Chat sidebar and the Editor panels.
- **`scrollRequest`**: A dedicated state that the `CodeEditor.tsx` listens to. When it changes, the editor calls `revealLineInCenter()`.
- **Automatic Cleanup**: In `ProChat.tsx`, we reset these states whenever a new message starts or the chat is cleared, ensuring a fresh experience for every interaction.

## 5. Visual Feedback (`index.css`)
- Added `.highlight-left` and `.highlight-right` classes that Monaco applies to lines.
- These classes use subtle gradients and borders rather than solid backgrounds, ensuring code remains readable while being clearly identified.
