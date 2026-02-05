



import { create } from 'zustand';

interface EditorPanel {
  label: string;
  language: string;
  code: string;
}

interface WorkspaceState {
  left: EditorPanel;
  right: EditorPanel;
  /**
   * updatePanel('left', { code: 'new' }) -> Updates code only
   * updatePanel('right', { language: 'js', label: 'New' }) -> Updates both
   */
  updatePanel: (side: 'left' | 'right', updates: Partial<EditorPanel>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  // Default values when the app starts
  left: { 
    label: "Current Version", 
    language: "javascript", 
    code: "" 
  },
  right: { 
    label: "Modified Version", 
    language: "javascript", 
    code: "" 
  },

  // The "Magic" update function
  updatePanel: (side, updates) => 
    set((state) => ({
      // [side] = the key 'left' or 'right'
      // ...state[side] = "Keep the existing data"
      // ...updates = "Overwrite with the new data I'm sending"
      [side]: { ...state[side], ...updates }
    })),
}));