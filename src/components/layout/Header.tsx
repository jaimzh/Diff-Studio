import {
  LayoutGrid,
  List,
  MessageSquare,
  Palette,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: "editor" | "diff" | "whiteboard";
  setActiveTab: (tab: "editor" | "diff" | "whiteboard") => void;
  chatMode: "regular" | "pro";
  setChatMode: (mode: "regular" | "pro") => void;
}

export const Header = ({
  activeTab,
  setActiveTab,
  chatMode,
  setChatMode,
}: HeaderProps) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center  gap-4 px-4">
        <div>
          <h2 className="text-xl font-bold text-text-base tracking-tight uppercase">
            Diff-Studio
          </h2>
          <p className="text-text-muted text-[11px] font-semibold uppercase tracking-widest mt-1">
            AI Code Review & Comparison
          </p>
        </div>

        <div className="bg-bg-light/50 p-1 rounded-md border border-border flex items-center">
          <Button
            variant={activeTab === "editor" ? "tabActive" : "tab"}
            size="tab"
            onClick={() => setActiveTab("editor")}
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-2" />
            Editor
          </Button>

          <Button
            variant={activeTab === "diff" ? "tabActive" : "tab"}
            size="tab"
            onClick={() => setActiveTab("diff")}
          >
            <List className="w-3.5 h-3.5 mr-2" />
            Visual Diff
          </Button>

          <Button
            variant={activeTab === "whiteboard" ? "tabActive" : "tab"}
            size="tab"
            onClick={() => setActiveTab("whiteboard")}
          >
            <Palette className="w-3.5 h-3.5 mr-2" />
            Canvas
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="bg-bg-light/50 p-1 rounded-md border border-border flex items-center ">
            <Button
              variant={chatMode === "regular" ? "tabActive" : "tab"}
              size="tab"
              onClick={() => setChatMode("regular")}
              className="h-8 px-3"
            >
              <MessageSquare className="w-3 h-3 mr-1.5" />
              Regular
            </Button>
            <Button
              variant={chatMode === "pro" ? "tabActive" : "tab"}
              size="tab"
              onClick={() => setChatMode("pro")}
              className="h-8 px-3"
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Pro Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
