import React, { useState } from "react";
import { Header } from "./components/layout/Header";
import { DiffViewer } from "./components/editor/DiffViewer";
import { CodeEditor } from "./components/editor/CodeEditor";
import { ChatSidebar } from "./components/chat/ChatSidebar";
import { ProChat } from "./components/chat/ProChat";
import { NotForMobile } from "./components/layout/NotForMobile";
import { LayoutGrid, List } from "lucide-react";
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
      <NotForMobile />
      <main className="flex-1 flex flex-col p-4 space-y-2 overflow-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chatMode={chatMode}
          setChatMode={setChatMode}
        />

        <div className="flex-1 min-h-0">
          <Group orientation="horizontal">
            <Panel defaultSize={75} minSize={30} className="flex">
              <div className="flex-1 bg-bg-light/50 rounded-2xl border border-border/50 p-2 overflow-hidden flex flex-col group/editors">
                {activeTab === "editor" ? (
                  <Group orientation="horizontal" className="h-full">
                    <Panel defaultSize={50} minSize={20} className="px-1">
                      <CodeEditor
                        side="left"
                        highlightClassName="highlight-left"
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
                        side="right"
                        highlightClassName="highlight-right"
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
                ) : (
                  <DiffViewer
                    original={left.code}
                    modified={right.code}
                    language={left.language}
                  />
                )}
              </div>
            </Panel>

            <Separator className="w-2 bg-transparent hover:bg-border/20 transition-all outline-none focus:outline-none focus:ring-0" />

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
