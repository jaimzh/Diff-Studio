import { Editor } from "@monaco-editor/react";
import type { LucideIcon } from "lucide-react";

interface CodeEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onLabelChange: (val: string) => void;
  onLanguageChange: (language: string) => void;
  language?: string;
  icon?: React.ReactNode;
}

export const CodeEditor = ({
  label,
  value,
  onChange,
  onLabelChange,
  language = "javascript",
  onLanguageChange,
  icon,
}: CodeEditorProps) => {
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

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-bg-light shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-bg-light z-10"></div>
      {/* header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-bg-light/50">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-text-muted group-hover:text-accent transition-colors">
              {icon}
            </div>
          )}
          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
            <input
              type="text"
              value={label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-0 text-text-muted focus:text-text-base transition-colors cursor-edit"
            />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bg-dark text-text-muted border border-border/50  "
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* editor */}
      <div className="flex-1 relative min-h-0 bg-bg-dark overflow-hidden">
        <Editor
          value={value}
          language={language}
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
