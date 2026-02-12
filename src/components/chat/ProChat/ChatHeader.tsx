import React from "react";
import { Sparkles, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-muted/30 text-foreground">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-foreground tracking-tight">
              Diff AI
            </h2>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">
            Powered by Puter.js
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onClear}
          className="p-2 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-md transition-colors text-xs font-medium flex items-center gap-1.5 group"
        >
          <Trash2 className="w-3.5 h-3.5 group-hover:text-red-400 transition-colors" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
