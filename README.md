# Diff-Studio

Diff Studio is a lightweight, client-side tool for comparing code or text side by side, with an AI-powered assistant that helps you understand, analyze, and interact with your content. It’s designed to be fast, private, and ephemeral, (fancy word for no data is stored or sent to any server). Everything happens locally in your browser.

## Features

- **Split-Pane Code Editor**: Edit two files side-by-side with full syntax highlighting (Monaco Editor).
- **Visual Diff Viewer**: Toggle to a diff view to instantly see insertions, deletions, and modifications between the two panes.
- **AI Integration**: A built-in chat assistant that can analyze the code in your active workspace, identifying bugs, security issues, or performance improvements.
- **Intelligent Highlighting**: The AI can programmatically highlight specific lines of code in your editor to point out exactly what it is referring to.
- **Responsive Design**: Designed primarily for desktop workflows, with checks for mobile compatibility.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Editor**: Monaco Editor (@monaco-editor/react)
- **State Management**: Zustand
- **AI Service**: Puter.js (for backend-less AI integration)

## Project Structure

```bash
src/
├── components/   # UI Building Blocks
│   ├── chat/
│   ├── editor/
│   ├── layout/
│   └── ui/
├── services/     # API Integration
├── store/        # State Management
└── utils/        # Helpers
```

## Getting Started

1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev

3. Open your browser to the local server address (usually http://localhost:5173).

## Usage

1. **Editors**: Paste or type code into the left (Original) and right (Modified) panels.
2. **Diff View**: Click "Visual Diff" in the header to see line-by-line differences.
3. **AI Assistant**: Open the sidebar (Regular or Pro Chat) and ask the assistant to analyze your code. It will read the content of both panels to provide context-aware answers.
