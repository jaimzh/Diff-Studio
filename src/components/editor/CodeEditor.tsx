import { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useWorkspaceStore } from "@/store/WorkspaceStore";
import { Trash2, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodeEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onLabelChange: (val: string) => void;
  onLanguageChange: (language: string) => void;
  language?: string;
  icon?: React.ReactNode;
  side?: "left" | "right";
  highlightClassName?: string;
}

export const CodeEditor = ({
  label,
  value,
  side,
  highlightClassName = "highlight-left",
  onChange,
  onLabelChange,
  language = "javascript",
  onLanguageChange,
  icon,
}: CodeEditorProps) => {
  const activeHighlights = useWorkspaceStore((state) => state.activeHighlights);
  const scrollRequest = useWorkspaceStore((state) => state.scrollRequest);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const LANGUAGES = [
    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "json",
  ];

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  const handleClear = () => {
    onChange("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (
      !editorRef.current ||
      !scrollRequest ||
      scrollRequest.side !== side ||
      scrollRequest.line === 0
    )
      return;

    const editor = editorRef.current;
    editor.revealLineInCenter(scrollRequest.line);

  
    setTimeout(() => {
      const current = useWorkspaceStore.getState().scrollRequest;
      if (current?.line === scrollRequest.line && current?.side === side) {
        useWorkspaceStore.setState({ scrollRequest: null });
      }
    }, 100);
  }, [scrollRequest, side]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !side) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;

    const relevantHighlights = activeHighlights.filter((h) => h.side === side);

    const newDecorations = relevantHighlights.map((h) => ({
      range: new monaco.Range(h.lines[0], 1, h.lines[1], 1),
      options: {
        isWholeLine: true,
        className: highlightClassName,
      },
    }));

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations,
    );
  }, [activeHighlights, side, highlightClassName]);

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-bg-light shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-bg-light z-10"></div>

      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-bg-light/50">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-text-muted ">
              {icon}
            </div>
          )}
          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="bg-transparent rounded-4xl border-none outline-none focus:ring-0 text-text-muted focus:text-text-base transition-colors cursor-text"
            />
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handlePaste}
                className="text-text-muted hover:text-text-base"
              >
                <Clipboard />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Paste from clipboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleClear}
                className="text-text-muted hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Clear editor</TooltipContent>
          </Tooltip>

          <div className="w-[1px] h-3 bg-border mx-1" />

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bg-dark text-text-muted border border-border/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 relative min-h-0 bg-bg-dark overflow-hidden">
        <Editor
          value={value}
          language={language}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            roundedSelection: true,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderLineHighlight: "all",
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
            },
          }}
        />
      </div>
    </div>
  );
};
