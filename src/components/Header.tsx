import React from "react";
import { Sparkles, Code2, Zap, Space, PlaneTakeoff, SolarPanelIcon } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-bg-base/50  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-2 rounded">
            <SolarPanelIcon className="w-5 h-5 text-bg-dark" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-base leading-none tracking-tight">
              Diff-Space
            </h1>
            <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] mt-1 uppercase">
              Compare & Analyze Code
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
