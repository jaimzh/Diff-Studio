import { puter } from "@heyputer/puter.js";
import { useWorkspaceStore } from "../store/WorkspaceStore";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export const aiService = {
  // Helper to get formatted context from the store
  getWorkspaceContext() {
    const { left, right } = useWorkspaceStore.getState();
    return `
WORKSPACE CONTEXT:
[Left Panel: "${left.label}" | Language: ${left.language}]
${left.code}

[Right Panel: "${right.label}" | Language: ${right.language}]
${right.code}
    `.trim();
  },

  async chatWithContext(messages: Message[], input: string) {
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
      - Analyze the code above.
      - Answer the user's latest query accurately and professionally.
      - Use markdown formatting for code blocks.
      - User's Question: "${input}"
    `;

    return await puter.ai.chat(systemPrompt, {
      stream: true,
      model: "gpt-4o-mini",
    });
  },

  async analyzeDiff() {
    const { left, right } = useWorkspaceStore.getState();
    const analysisPrompt = `
      You are a senior dev. Compare these two versions:
      
      VERSION A (${left.label}):
      \`\`\`${left.language}
      ${left.code}
      \`\`\`

      VERSION B (${right.label}):
      \`\`\`${right.language}
      ${right.code}
      \`\`\`

      TASK:
      - Provide a concise summary of the logic changes.
      - Highlight improvements in performance, security, or readability.
      - Flag any regression or bugs you notice.
    `;

    return await puter.ai.chat(analysisPrompt, {
      stream: true,
      model: "gpt-4o-mini",
    });
  },
};
