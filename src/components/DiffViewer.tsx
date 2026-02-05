import { DiffEditor } from "@monaco-editor/react";

interface DiffViewerProps {
  original: string;
  modified: string;
  language: string;
}

export const DiffViewer = ({
  original,
  modified,
  language,
}: DiffViewerProps) => {
  return (
    <div className="flex-1 h-full bg-bg-light/50 rounded-2xl border border-border/50 p-2 overflow-hidden flex flex-col relative group/editors">
      <div className="flex-1 relative min-h-0 bg-bg-dark rounded-xl overflow-hidden border border-border">
        <DiffEditor
          original={original}
          modified={modified}
          language={language}
          theme="vs-dark"
          options={{
            renderSideBySide: true,
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
            },
          }}
        />
      </div>
    </div>
  );
};
