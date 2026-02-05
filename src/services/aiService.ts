import { puter } from "@heyputer/puter.js";
import { useWorkspaceStore } from "../store/WorkspaceStore";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export const aiService = {
  getWorkspaceContext() {
    const { left, right } = useWorkspaceStore.getState();

    const addLineNumbers = (code: string) =>
      code
        .split("\n")
        .map((line, i) => `${i + 1}: ${line}`)
        .join("\n");

    return `
WORKSPACE CONTEXT:
[Left Panel: "${left.label}" | Language: ${left.language}]
${addLineNumbers(left.code)}

[Right Panel: "${right.label}" | Language: ${right.language}]
${addLineNumbers(right.code)}
    `.trim();
  },

  async chatWithContext(messages: Message[], input: string) {
    const { left, right } = useWorkspaceStore.getState();
    const context = this.getWorkspaceContext();
    const history = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const systemPrompt = `
      You are an expert software engineer and code reviewer.

      ${context}

      CONVERSATION HISTORY:
      ${history}

      INSTRUCTIONS:
      - Analyze the code provided in the context above.
      - **Always refer to the code sections by their specific labels** (e.g., refer to "${left.label}" and "${right.label}").
      - **CRITICAL: When discussing logic, YOU MUST USE HIGHLIGHT TAGS.**
        - Syntax: [[left|line 10-15]] or [[right|line 4]]
        - These tags create interactive buttons; use them often and precisely.
        - Example: "The variable is initialized here [[left|line 2]] and updated inside this loop [[left|line 4-8]]."
        - Always double-check your line numbers against the context code provided.
      - Answer user queries accurately and professionally.
      - User's Question: "${input}"
    `;

    return await puter.ai.chat(systemPrompt, {
      stream: true,
      model: "gpt-4o",
    });
  },

  async analyzeDiff() {
    const { left, right } = useWorkspaceStore.getState();
    const analysisPrompt = `
      You are a senior developer. Compare these two versions:
      
      VERSION A (${left.label}):
      ${left.code}

      VERSION B (${right.label}):
      ${right.code}

      TASK:
      - Compare the logic between "${left.label}" and "${right.label}".
      - **YOU MUST USE HIGHLIGHT TAGS for every point of comparison.**
        - Syntax: [[left|line X-Y]] or [[right|line Z]]
        - Example: "In "${left.label}", the loop starts at [[left|line 10]]. In "${right.label}", it's replaced by a map at [[right|line 12]]."
      - Highlight improvements in performance, security, or readability.
      - Provide a concise summary.
    `;

    return await puter.ai.chat(analysisPrompt, {
      stream: true,
      model: "gpt-4o",
    });
  },
};
