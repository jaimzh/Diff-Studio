import {
  Bot,
  Loader2,
  Maximize2,
  Minimize2,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { aiService, type Message } from "../../services/aiService";
import { useWorkspaceStore } from "@/store/WorkspaceStore";
import { parseAndApplyHighlights } from "@/utils/highlightParser";
import { MessageResponse } from "./ai-elements/message";

export const ChatSidebar: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Clear previous highlights and reset scroll tracker
    const store = useWorkspaceStore.getState();
    store.setHighlights([]);
    (store as any)._lastScrollRequest = null;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const stream = await aiService.chatWithContext(messages, input);

      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        text: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let fullText = "";
      for await (const part of stream) {
        fullText += typeof part === "string" ? part : part.text || "";

        // Parse highlights and get clean content for display
        const displayContent = parseAndApplyHighlights(fullText);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: displayContent } : m,
          ),
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const startAnalysis = async () => {
    setIsTyping(true);

    // Clear previous highlights and reset scroll tracker
    const store = useWorkspaceStore.getState();
    store.setHighlights([]);
    (store as any)._lastScrollRequest = null;

    try {
      const stream = await aiService.analyzeDiff();

      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        text: "",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      let fullText = "";

      for await (const part of stream) {
        fullText += typeof part === "string" ? part : part.text || "";

        // Parse highlights and get clean content for display
        const displayContent = parseAndApplyHighlights(fullText);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, text: displayContent } : m,
          ),
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div
      className={`
      fixed bottom-6 right-6 z-40 transition-all duration-300 ease-in-out flex flex-col
      bg-bg-light border border-border rounded-lg
      ${isExpanded ? "w-[600px] h-[700px]" : "w-[400px] h-[550px]"}
      md:relative md:bottom-auto md:right-auto md:h-full md:w-full
    `}
    >
      <div className="px-4 py-3 border-b border-border bg-bg-light/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <Bot className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-text-base uppercase tracking-widest">
              Assistant
            </h3>
            <p className="text-[9px] text-text-muted uppercase tracking-[0.15em] font-medium">
              Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-bg-dark text-text-muted hover:text-text-base rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-bg-dark text-text-muted hover:text-text-base rounded transition-colors hidden md:block cursor-pointer"
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/20"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 bg-bg-light rounded-full flex items-center justify-center mb-4 border border-border">
              <Bot className="w-6 h-6 text-text-muted" />
            </div>
            <h4 className="text-text-base text-sm font-bold uppercase tracking-widest mb-2">
              System Initialized
            </h4>
            <p className="text-[11px] text-text-muted mb-6 leading-relaxed max-w-[200px]">
              Ready to analyze code changes and structural improvements.
            </p>
            <button
              onClick={startAnalysis}
              className="px-5 py-2 bg-accent hover:opacity-90 text-accent-foreground rounded text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Run Deep Analysis
            </button>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`
              w-7 h-7 rounded shrink-0 flex items-center justify-center text-[10px]
              ${m.role === "user" ? "bg-bg-light text-text-muted border border-border" : "bg-accent text-accent-foreground"}
            `}
            >
              {m.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`
              max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed
              ${
                m.role === "user"
                  ? "bg-bg-light/50 text-text-muted rounded-lg border border-border/50"
                  : "bg-bg-dark border border-border/50 text-text-muted rounded-lg"
              }
            `}
            >
              <MessageResponse>{m.text}</MessageResponse>
            </div>
          </div>
        ))}

        {isTyping && messages[messages.length - 1]?.text === "" && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded bg-accent text-accent-foreground flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-bg-dark border border-border rounded-lg px-4 py-3 flex items-center gap-1">
              <span className="w-1 h-1 bg-text-muted rounded-full animate-pulse"></span>
              <span className="w-1 h-1 bg-text-muted rounded-full animate-pulse [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-text-muted rounded-full animate-pulse [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-bg-light border-t border-border">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Analysis request..."
            className="w-full bg-bg-dark border border-border rounded px-4 py-3 pr-12 text-[13px] text-text-base outline-none focus:border-text-muted/50 transition-colors resize-none h-[50px] overflow-hidden"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-accent hover:opacity-90 disabled:opacity-50 text-accent-foreground rounded transition-all cursor-pointer"
          >
            {isTyping ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
