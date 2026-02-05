// Protocol: [[left|line 10-15]] or [[right|line 4]]

import { useWorkspaceStore, type Highlight } from "@/store/WorkspaceStore";

// Regex to find [[side|line X-Y]] or [[side|line X]]
const REFERENCE_REGEX = /\[\[(left|right)\|line\s+(\d+)(?:-(\d+))?\]\]/g;

export function parseAndApplyHighlights(content: string): string {
  const highlights: Highlight[] = [];

  // We want to remove the tags from the displayed text,
  // so we'll replace them with an empty string or a subtle icon eventually.
  // For now, let's clean them out and extract data.

  const cleanedContent = content.replace(
    REFERENCE_REGEX,
    (_match, side, startLine, endLine) => {
      const start = parseInt(startLine, 10);
      const end = endLine ? parseInt(endLine, 10) : start;

      highlights.push({
        side: side as "left" | "right",
        lines: [start, end],
      });

      // Transform to a markdown link that we'll handle in the UI
      const label = endLine ? `L${start}-${end}` : `L${start}`;
      return `[${label}](https://highlight.me/${side}/${start}${endLine ? `-${endLine}` : ""})`;
    },
  );

  const store = useWorkspaceStore.getState();
  store.setHighlights(highlights);

  // If we found highlights and we're not already scrolling,
  // request scroll to the first one found.
  if (highlights.length > 0 && !store.scrollRequest) {
    const first = highlights[0];
    const side = first.side;
    const line = first.lines[0];

    // Only scroll if this is actually a new highlight compared to the last scroll request
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
