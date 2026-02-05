

import { useWorkspaceStore, type Highlight } from "@/store/WorkspaceStore";


const REFERENCE_REGEX = /\[\[(left|right)\|line\s+(\d+)(?:-(\d+))?\]\]/g;

export function parseAndApplyHighlights(content: string): string {
  const highlights: Highlight[] = [];

  
  const cleanedContent = content.replace(
    REFERENCE_REGEX,
    (_match, side, startLine, endLine) => {
      const start = parseInt(startLine, 10);
      const end = endLine ? parseInt(endLine, 10) : start;

      highlights.push({
        side: side as "left" | "right",
        lines: [start, end],
      });

    
      const label = endLine ? `L${start}-${end}` : `L${start}`;
      return `[${label}](https://highlight.me/${side}/${start}${endLine ? `-${endLine}` : ""})`;
    },
  );

  const store = useWorkspaceStore.getState();
  store.setHighlights(highlights);

  if (highlights.length > 0 && !store.scrollRequest) {
    const first = highlights[0];
    const side = first.side;
    const line = first.lines[0];

    const lastRequest = (store as any)._lastScrollRequest;
    if (
      !lastRequest ||
      lastRequest.side !== side ||
      lastRequest.line !== line
    ) {
      store.requestScroll(side, line);
      (store as any)._lastScrollRequest = { side, line };
    }
  }

  return cleanedContent;
}
