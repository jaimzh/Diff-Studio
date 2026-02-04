import React, { useState } from "react";
import { Header } from "./components/Header";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "./components/ui/button";
import { CodeEditor } from "./components/CodeEditor";
import { ChatSidebar } from "./components/ChatSidebar";
import { ProChat } from "./components/ProChat";
import { Sparkles, MessageSquare } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "./lib/utils";
import { useWorkspaceStore } from "./store/WorkspaceStore";

function App() {
  const left = useWorkspaceStore((state) => state.left);
  const right = useWorkspaceStore((state) => state.right);

  const updatePanel = useWorkspaceStore((state) => state.updatePanel);

  const setCode = useWorkspaceStore((s) => s.setPanelCode);
  const setLabel = useWorkspaceStore((s) => s.setPanelLabel);
  const setLanguage = useWorkspaceStore((s) => s.setPanelLanguage);

  const [activeTab, setActiveTab] = useState<"editor" | "diff">("editor");
  const [chatMode, setChatMode] = useState<"regular" | "pro">("regular");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-dark">
      {/* <Header /> */}
      <main className="flex-1 flex flex-col p-4 md:p-8 space-y-8 overflow-hidden">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-base tracking-tight uppercase">
                Workspace
              </h2>
              <p className="text-text-muted text-[11px] font-semibold uppercase tracking-widest mt-1">
                Version Control & AI Review
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
            </div>

            <div className="flex gap-2">
              <div className="bg-bg-light/50 p-1 rounded-md border border-border flex items-center mr-4">
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

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[11px] font-bold uppercase tracking-wider"
              >
                Reset
              </Button>
              <Button
                size="sm"
                className="h-8 text-[11px] font-bold uppercase tracking-wider"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Group orientation="horizontal">
            {/* Main Editor Section */}
            <Panel defaultSize={75} minSize={30} className="flex">
              <div className="flex-1 bg-bg-light/50 rounded-2xl border border-border/50 p-2 overflow-hidden flex flex-col group/editors">
                <Group orientation="horizontal" className="h-full">
                  <Panel defaultSize={50} minSize={20} className="px-1">
                    <CodeEditor
                      label={left.label}
                      value={left.code}
                      onChange={(val) => setCode("left", val)}
                      onLabelChange={(val) => setLabel("left", val)}
                      onLanguageChange={(val) => setLanguage("left", val)}
                      language={left.language}
                      icon={<LayoutGrid className="w-3.5 h-3.5" />}
                    />
                  </Panel>

                  <Separator className="w-2 bg-bg-light hover:bg-border transition-all outline-none focus:outline-none focus:ring-0" />

                  <Panel defaultSize={50} minSize={20} className="px-1">
                    <CodeEditor
                      label={right.label}
                      value={right.code}
                      onChange={(val) => setCode("right", val)}
                      onLabelChange={(val) => setLabel("right", val)}
                      onLanguageChange={(val) => setLanguage("right", val)}
                      language={right.language}
                      icon={<List className="w-3.5 h-3.5" />}
                    />
                  </Panel>
                </Group>
              </div>
            </Panel>

            <Separator className="w-2 bg-transparent hover:bg-border/20 transition-all outline-none focus:outline-none focus:ring-0" />

            {/* Chat/AI Section */}
            <Panel
              defaultSize={25}
              minSize={15}
              className="bg-bg-light/20 rounded-xl border border-border shadow-2xl overflow-hidden"
            >
              {chatMode === "regular" ? <ChatSidebar /> : <ProChat />}
            </Panel>
          </Group>
        </div>
      </main>
    </div>
  );
}

export default App;
