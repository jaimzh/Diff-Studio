import { create } from "zustand";

interface EditorPanel {
  label: string;
  language: string;
  code: string;
}

interface WorkspaceState {
  left: EditorPanel;
  right: EditorPanel;

  setPanelCode: (side: "left" | "right", code: string) => void;
  setPanelLanguage: (side: "left" | "right", language: string) => void;
  setPanelLabel: (side: "left" | "right", label: string) => void;

  updatePanel: (side: "left" | "right", updates: Partial<EditorPanel>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // INITIAL VALUES
  left: {
    label: "Original Source",
    language: "typescript",
    code: `// Traditional for-loop approach\nconst numbers = [1, 2, 3];\nconst doubled = [];\n\nfor (let i = 0; i < numbers.length; i++) {\n  doubled.push(numbers[i] * 2);\n}`,
  },
  right: {
    label: "AI Refactored",
    language: "typescript",
    code: `// Clean, functional approach\nconst numbers = [1, 2, 3];\n\nconst doubled = numbers.map(n => n * 2);`,
  },

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
