import { puter } from "@heyputer/puter.js";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export const aiService = {
  async chatWithContext(
    leftCode: string,
    rightCode: string,
    messages: Message[],
    input: string,
  ) {
    const history = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const contextPrompt = `
      Conversation history:
      ${history}

      You are a specialized code reviewer. 
      Original code (Left): 
      ${leftCode}
      
      Modified code (Right): 
      ${rightCode}
      
      The user is asking: "${input}"
    `;

    return await puter.ai.chat(contextPrompt, {
      stream: true,
      model: "gpt-4o-mini",
    });
  },

  async analyzeDiff(leftCode: string, rightCode: string) {
    const analysisPrompt = `
      Compare these two code snippets and give a professional, concise summary of the changes.
      Original: ${leftCode}
      Modified: ${rightCode}
      Focus on performance, readability, and logic.
    `;

    return await puter.ai.chat(analysisPrompt, {
      stream: true,
      model: "gpt-4o-mini",
    });
  },
};
