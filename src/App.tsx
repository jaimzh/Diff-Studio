import React, { useState } from "react";
import { Header } from "./components/Header";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "./components/ui/button";
import { CodeEditor } from "./components/CodeEditor";
import { ChatSidebar } from "./components/ChatSidebar";
import { ProChat } from "./components/ProChat";
import { Sparkles, MessageSquare } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "./lib/utils";

const ResizeHandle = ({
  direction = "horizontal",
  className = "",
}: {
  direction?: "horizontal" | "vertical";
  className?: string;
}) => {
  const isHorizontal = direction === "horizontal";
  return (
    <PanelResizeHandle
      className={cn(
        "flex items-center justify-center transition-all duration-300 group z-50",
        isHorizontal
          ? "w-1.5 hover:w-2 cursor-col-resize"
          : "h-1.5 hover:h-2 cursor-row-resize",
        className,
      )}
    >
      <div
        className={cn(
          "bg-border/20 group-hover:bg-accent/40 rounded-full transition-all duration-300",
          isHorizontal
            ? "w-[2px] h-10 group-hover:h-16"
            : "h-[2px] w-10 group-hover:w-16",
        )}
      />
    </PanelResizeHandle>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState<"editor" | "diff">("editor");
  const [chatMode, setChatMode] = useState<"regular" | "pro">("regular");

  // code state (The code inside)
  const [leftCode, setLeftCode] = useState(`// Original: Basic loop
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`);

  const [rightCode, setRightCode] = useState(`// Optimized: Using Reduce
function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + item.price;
  }, 0);
}`);

  // label state
  const [leftLabel, setLeftLabel] = useState("Current Version");
  const [rightLabel, setRightLabel] = useState("Modified Version");

  // language state
  const [leftLanguage, setLeftLanguage] = useState("javascript");
  const [rightLanguage, setRightLanguage] = useState("javascript");

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
          <PanelGroup direction="horizontal">
            {/* Main Editor Section */}
            <Panel defaultSize={75} minSize={30} className="flex">
              {activeTab === "editor" ? (
                <div className="flex-1 h-full px-1">
                  <CodeEditor
                    label={leftLabel}
                    value={leftCode}
                    onChange={setLeftCode}
                    onLabelChange={setLeftLabel}
                    onLanguageChange={setLeftLanguage}
                    language={leftLanguage}
                    icon={<LayoutGrid className="w-3.5 h-3.5" />}
                  />
                </div>
              ) : (
                <PanelGroup direction="horizontal" className="h-full">
                  <Panel defaultSize={50} minSize={20} className="px-1">
                    <CodeEditor
                      label={leftLabel}
                      value={leftCode}
                      onChange={setLeftCode}
                      onLabelChange={setLeftLabel}
                      onLanguageChange={setLeftLanguage}
                      language={leftLanguage}
                      icon={<LayoutGrid className="w-3.5 h-3.5" />}
                    />
                  </Panel>

                  <ResizeHandle />

                  <Panel defaultSize={50} minSize={20} className="px-1">
                    <CodeEditor
                      label={rightLabel}
                      value={rightCode}
                      onChange={setRightCode}
                      onLabelChange={setRightLabel}
                      onLanguageChange={setRightLanguage}
                      language={rightLanguage}
                      icon={<List className="w-3.5 h-3.5" />}
                    />
                  </Panel>
                </PanelGroup>
              )}
            </Panel>

            <ResizeHandle />

            {/* Chat/AI Section */}
            <Panel
              defaultSize={25}
              minSize={15}
              className="bg-bg-light/20 rounded-xl border border-border shadow-2xl overflow-hidden ml-1"
            >
              {chatMode === "regular" ? (
                <ChatSidebar leftCode={leftCode} rightCode={rightCode} />
              ) : (
                <ProChat leftCode={leftCode} rightCode={rightCode} />
              )}
            </Panel>
          </PanelGroup>
        </div>
      </main>
    </div>
  );
}

export default App;
