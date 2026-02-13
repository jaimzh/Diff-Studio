import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { DiffViewer } from "./components/editor/DiffViewer";
import { CodeEditor } from "./components/editor/CodeEditor";
import { ChatSidebar } from "./components/chat/ChatSidebar";
import { ProChat } from "./components/chat/ProChat/index";
import { NotForMobile } from "./components/layout/NotForMobile";
import { Preloader } from "./components/layout/Preloader";
import { Whiteboard } from "./components/whiteboard/Whiteboard";
import "@excalidraw/excalidraw/index.css";
import { Code, Code2, MessageSquare } from "lucide-react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import { useWorkspaceStore } from "./store/WorkspaceStore";
import { AnimatePresence } from "motion/react";
import { Button } from "./components/ui/button";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const left = useWorkspaceStore((state) => state.left);
  const right = useWorkspaceStore((state) => state.right);

  const setCode = useWorkspaceStore((s) => s.setPanelCode);
  const setLabel = useWorkspaceStore((s) => s.setPanelLabel);
  const setLanguage = useWorkspaceStore((s) => s.setPanelLanguage);

  const chatPanelRef = usePanelRef();
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);

  const Panel1Ref = usePanelRef();
  const Panel2Ref = usePanelRef();

  const [isPanel1Collapsed, setIsPanel1Collapsed] = useState(false);
  const [isPanel2Collapsed, setIsPanel2Collapsed] = useState(false);

  const [activeTab, setActiveTab] = useState<"editor" | "diff" | "whiteboard">(
    "editor",
  );
  const [chatMode, setChatMode] = useState<"regular" | "pro">("regular");

  const panelCollapsedClass =
    "h-full w-full gap-10 flex flex-col items-center pt-6 bg-bg-light/40 hover:bg-bg-light/60 transition-colors cursor-pointer group";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

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
              <Panel defaultSize="75%" minSize="30%" className="flex">
                <div className="flex-1 bg-bg-light/50 rounded-2xl border border-border/50 p-2 overflow-hidden flex flex-col group/editors">
                  {activeTab === "editor" ? (
                    <Group orientation="horizontal" className="h-full">
                      <Panel
                        panelRef={Panel1Ref}
                        collapsible
                        collapsedSize="4%"
                        onResize={(size) => {
                          if (size.asPercentage < 5) {
                            setIsPanel1Collapsed(true);
                          } else {
                            setIsPanel1Collapsed(false);
                          }
                        }}
                        defaultSize="50%"
                        minSize="5%"
                        className="px-1"
                      >
                        {isPanel1Collapsed ? (
                          <div
                            className={panelCollapsedClass}
                            onClick={() => {
                              Panel1Ref.current?.resize("50%");
                              setIsPanel1Collapsed(false);
                            }}
                          >
                            <Code className="w-5 h-5 text-text-muted mb-6 group-hover:scale-110 transition-transform" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent text-text-muted group-hover:text-text-base rotate-90 whitespace-nowrap"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                {left.label}
                              </span>
                            </Button>
                          </div>
                        ) : (
                          <CodeEditor
                            side="left"
                            highlightClassName="highlight-left"
                            label={left.label}
                            value={left.code}
                            onChange={(val) => setCode("left", val)}
                            onLabelChange={(val) => setLabel("left", val)}
                            onLanguageChange={(val) => setLanguage("left", val)}
                            language={left.language}
                            icon={<Code className="w-3.5 h-3.5" />}
                          />
                        )}
                      </Panel>

                      <Separator
                        className={`${isPanel1Collapsed || isPanel2Collapsed ? "w-1" : "w-2"} ${isPanel1Collapsed || isPanel2Collapsed ? "bg-transparent" : "bg-bg-light"} hover:bg-border transition-all outline-none focus:outline-none focus:ring-0`}
                      />

                      <Panel
                        panelRef={Panel2Ref}
                        collapsible
                        collapsedSize="4%"
                        onResize={(size) => {
                          if (size.asPercentage < 5) {
                            setIsPanel2Collapsed(true);
                          } else {
                            setIsPanel2Collapsed(false);
                          }
                        }}
                        defaultSize="50%"
                        minSize="5%"
                        className="px-1"
                      >
                        {isPanel2Collapsed ? (
                          <div
                            className={panelCollapsedClass}
                            onClick={() => {
                              Panel2Ref.current?.resize("50%");
                              setIsPanel2Collapsed(false);
                            }}
                          >
                            <Code2 className="w-5 h-5 text-text-muted mb-6 group-hover:scale-110 transition-transform" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 hover:bg-transparent text-text-muted group-hover:text-text-base rotate-90 whitespace-nowrap"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                {right.label}
                              </span>
                            </Button>
                          </div>
                        ) : (
                          <CodeEditor
                            side="right"
                            highlightClassName="highlight-right"
                            label={right.label}
                            value={right.code}
                            onChange={(val) => setCode("right", val)}
                            onLabelChange={(val) => setLabel("right", val)}
                            onLanguageChange={(val) =>
                              setLanguage("right", val)
                            }
                            language={right.language}
                            icon={<Code2 className="w-3.5 h-3.5" />}
                          />
                        )}
                      </Panel>
                    </Group>
                  ) : activeTab === "whiteboard" ? (
                    <Whiteboard />
                  ) : (
                    <DiffViewer
                      original={left.code}
                      modified={right.code}
                      language={left.language}
                    />
                  )}
                </div>
              </Panel>

              <Separator className="w-2 bg-transparent hover:bg-border transition-all outline-none focus:outline-none focus:ring-0" />

              <Panel
                panelRef={chatPanelRef}
                collapsible
                defaultSize="3%"
                minSize="15%"
                maxSize="60%"
                collapsedSize="3%"
                onResize={(size) => {
                  if (size.asPercentage < 10) {
                    setIsChatCollapsed(true);
                  } else {
                    setIsChatCollapsed(false);
                  }
                }}
                className="bg-bg-light/20 rounded-xl border border-border shadow-2xl overflow-hidden"
              >
                {isChatCollapsed ? (
                  <div
                    className="h-full w-full gap-4 flex flex-col items-center rounded-xl pt-8  bg-bg-light/40 hover:bg-bg-light/60 transition-colors cursor-pointer group"
                    onClick={() => {
                      chatPanelRef.current?.resize("25%");
                      setIsChatCollapsed(false);
                    }}
                  >
                    <MessageSquare className="w-5 h-5 text-text-muted mb-6 group-hover:scale-110 transition-transform" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent text-text-muted group-hover:text-text-base rotate-90 whitespace-nowrap"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Assistant
                      </span>
                    </Button>
                  </div>
                ) : chatMode === "regular" ? (
                  <ChatSidebar />
                ) : (
                  <ProChat />
                )}
              </Panel>
            </Group>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
