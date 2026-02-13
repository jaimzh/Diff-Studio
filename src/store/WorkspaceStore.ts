import { create } from "zustand";

interface EditorPanel {
  label: string;
  language: string;
  code: string;
}

export interface Highlight {
  side: "left" | "right";
  lines: [number, number]; // [start, end]
}

interface WorkspaceState {
  left: EditorPanel;
  right: EditorPanel;

  // NEW: Highlights state
  activeHighlights: Highlight[];
  scrollRequest: { side: "left" | "right"; line: number } | null;
  setHighlights: (highlights: Highlight[]) => void;
  requestScroll: (side: "left" | "right", line: number) => void;

  setPanelCode: (side: "left" | "right", code: string) => void;
  setPanelLanguage: (side: "left" | "right", language: string) => void;
  setPanelLabel: (side: "left" | "right", label: string) => void;

  updatePanel: (side: "left" | "right", updates: Partial<EditorPanel>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // INITIAL VALUES
  left: {
    label: "Instructions",
    language: "markdown",
    code: `# Welcome to Diff Studio

Diff Studio is a modern, AI-powered development workspace designed to streamline your coding workflow.

### What is Diff Studio?
Diff Studio provides a seamless environment for code comparison, refactoring, and creative brainstorming. It's built for developers who value clarity and speed.

### Key Features:
**Dual-Pane Editor**: Write and edit code in two independent panels.
**Intelligent Diff Viewing**: Instantly see the differences between snippets with precision.
**Pro AI Assistant**: Interact with a powerful AI that understands your code context.
**Creative Whiteboard**: Sketch architecture designs directly within your workspace.
**Premium UI**: Optimized for focus with a sleek, dark-mode aesthetic.

### How to get started:
1. **Explore**: Try editing the code in either panel.
2. **Compare**: Click the 'Diff' tab in the header to see visual changes.
3. **Analyze**: Use the Assistant on the right to ask questions or request refactors.

*Happy Coding!*`,
  },
  right: {
    label: "Jaimz code",
    language: "python",
    code: `def greet(name):\n    """Simple function to welcome you."""\n    return f"Hello, {name}! Welcome to Diff Studio."\n\n# Try changing this or asking the AI to refactor it!\nprint(greet("Developer"))`,
  },

  activeHighlights: [],
  scrollRequest: null,
  setHighlights: (highlights) => set({ activeHighlights: highlights }),
  requestScroll: (side, line) => set({ scrollRequest: { side, line } }),

  setPanelCode: (side, code) =>
    set((state) => ({
      [side]: { ...state[side], code },
    })),
  setPanelLabel: (side, label) =>
    set((state) => ({
      [side]: { ...state[side], label },
    })),
  setPanelLanguage: (side, language) =>
    set((state) => ({
      [side]: { ...state[side], language },
    })),

  updatePanel: (side, updates) =>
    set((state) => ({ [side]: { ...state[side], ...updates } })),
}));
