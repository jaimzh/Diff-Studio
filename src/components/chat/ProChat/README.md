# ProChat Component Map

This folder contains the main AI Chat interface for Diff Studio. It has been broken down to make it easier to maintain and understand.

## 📁 File Structure

- **`index.tsx`**: The "Brain". This is where all the logic, state, and AI service calls live. If you want to change how the chat behaves, start here.
- **`ChatHeader.tsx`**: The top bar of the chat. Includes the title and the "Clear" button.
- **`ChatMessages.tsx`**: Responsible for rendering the conversation history, including reasoning blocks and sources.
- **`ChatInput.tsx`**: The complex input area. Handles text, attachments, model switching, and voice/search toggles.
- **`ChatSuggestions.tsx`**: The quick-action buttons (e.g., "Run Deep Analysis").
- **`constants.ts`**: Configuration for AI models and suggestion text.
- **`types.ts`**: TypeScript definitions used throughout the multi-file component.

## 🛠️ What should I touch?

### 1. I want to change the AI's behavior / personality

- Go to `src/services/aiService.ts`. This is outside this folder but is the core engine.

### 2. I want to add a new button or Quick Action

- Add the text to `constants.ts`.
- If it needs special logic (like "Deep Analysis"), add a handler in `index.tsx`.

### 3. I want to change how messages look

- Edit `ChatMessages.tsx`.

### 4. I want to change the input style or add a new tool

- Edit `ChatInput.tsx`.

---

_Generated for Jaimz to keep the codebase clean._
