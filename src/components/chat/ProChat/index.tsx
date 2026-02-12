"use client";

import React, { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/WorkspaceStore";
import { aiService, type Message as AIMessage } from "@/services/aiService";
import { parseAndApplyHighlights } from "@/utils/highlightParser";

import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatInput } from "./ChatInput";
import type { MessageType } from "./types";
import type { PromptInputMessage } from "../ai-elements/prompt-input";

export const ProChat: React.FC = () => {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const addUserMessage = useCallback(
    async (content: string) => {
      const store = useWorkspaceStore.getState();
      store.setHighlights([]);
      (store as any)._lastScrollRequest = null;

      const userMessage: MessageType = {
        key: nanoid(),
        from: "user",
        versions: [{ id: nanoid(), content }],
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus("streaming");

      const assistantMessageId = nanoid();
      const assistantMessage: MessageType = {
        key: nanoid(),
        from: "assistant",
        versions: [{ id: assistantMessageId, content: "" }],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const simpleHistory: AIMessage[] = messages
          .filter((m) => m.versions[0].content !== "")
          .map((m) => ({
            id: m.key,
            role: m.from,
            text: m.versions[0].content,
          }));

        const stream = await aiService.chatWithContext(simpleHistory, content);

        let fullText = "";
        for await (const part of stream) {
          fullText += typeof part === "string" ? part : part.text || "";

          const displayContent = parseAndApplyHighlights(fullText);

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.versions.some((v) => v.id === assistantMessageId)) {
                return {
                  ...msg,
                  versions: msg.versions.map((v) =>
                    v.id === assistantMessageId
                      ? { ...v, content: displayContent }
                      : v,
                  ),
                };
              }
              return msg;
            }),
          );
        }
      } catch (error) {
        console.error("ProChat Error:", error);
        toast.error("Assistant failed to respond.");
      } finally {
        setStatus("ready");
      }
    },
    [messages],
  );

  const handleSuggestionClick = async (suggestion: string) => {
    const store = useWorkspaceStore.getState();
    store.setHighlights([]);
    (store as any)._lastScrollRequest = null;

    if (suggestion === "Run Deep Analysis") {
      const userMsg: MessageType = {
        key: nanoid(),
        from: "user",
        versions: [
          {
            id: nanoid(),
            content: "Please analyze the differences between these panels.",
          },
        ],
      };
      setMessages((prev) => [...prev, userMsg]);
      setStatus("streaming");

      const assistantId = nanoid();
      setMessages((prev) => [
        ...prev,
        {
          key: nanoid(),
          from: "assistant",
          versions: [{ id: assistantId, content: "" }],
        },
      ]);

      try {
        const stream = await aiService.analyzeDiff();
        let fullText = "";
        for await (const part of stream) {
          fullText += typeof part === "string" ? part : part.text || "";

          const displayContent = parseAndApplyHighlights(fullText);

          setMessages((prev) =>
            prev.map((m) =>
              m.versions[0].id === assistantId
                ? {
                    ...m,
                    versions: [{ ...m.versions[0], content: displayContent }],
                  }
                : m,
            ),
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setStatus("ready");
      }
    } else {
      addUserMessage(suggestion);
    }
  };

  const handleClear = () => {
    setMessages([]);
    const store = useWorkspaceStore.getState();
    store.setHighlights([]);
    (store as any)._lastScrollRequest = null;
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim() && !message.files?.length) return;

    setStatus("submitted");
    addUserMessage(message.text || "Attached files analysis");
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden border-l border-border bg-background">
      <ChatHeader onClear={handleClear} />
      <ChatMessages messages={messages} />
      <div className="grid shrink-0 gap-4 pt-4">
        <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
        <ChatInput status={status} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
