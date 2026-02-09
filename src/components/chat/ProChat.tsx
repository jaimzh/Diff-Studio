"use client";

import React, { useCallback, useState } from "react";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "./ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageThinking,
} from "./ai-elements/message";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "./ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "./ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "./ai-elements/sources";
import { Suggestion, Suggestions } from "./ai-elements/suggestion";
import type { ToolUIPart } from "ai";
import { CheckIcon, GlobeIcon, MicIcon, Sparkles, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/WorkspaceStore";
import { aiService, type Message as AIMessage } from "@/services/aiService";
import { parseAndApplyHighlights } from "@/utils/highlightParser";

interface MessageType {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
}

const initialMessages: MessageType[] = [];

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic"],
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
];

const suggestions = [
  "Run Deep Analysis",
  "Suggest optimizations",
  "Check for security bugs",
  "Refactor to Clean Code",
];

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

export const ProChat: React.FC = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState<string>("");
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const [useMicrophone, setUseMicrophone] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  const selectedModelData = models.find((m) => m.id === model);

  const addUserMessage = useCallback(
    async (content: string) => {
      // Clear previous highlights and reset scroll tracker
      const store = useWorkspaceStore.getState();
      store.setHighlights([]);
      (store as any)._lastScrollRequest = null;

      // 1. Add user message to UI
      const userMessage: MessageType = {
        key: nanoid(),
        from: "user",
        versions: [{ id: nanoid(), content }],
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus("streaming");

      // 2. Prepare for Assistant message
      const assistantMessageId = nanoid();
      const assistantMessage: MessageType = {
        key: nanoid(),
        from: "assistant",
        versions: [{ id: assistantMessageId, content: "" }],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // 3. Call the REAL aiService
        const simpleHistory: AIMessage[] = messages
          .filter((m) => m.versions[0].content !== "") // filter out empty assistant message we just added
          .map((m) => ({
            id: m.key,
            role: m.from,
            text: m.versions[0].content,
          }));

        const stream = await aiService.chatWithContext(simpleHistory, content);

        let fullText = "";
        for await (const part of stream) {
          fullText += typeof part === "string" ? part : part.text || "";

          // Parse highlights and get clean content for display
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
    // Clear previous highlights and reset scroll tracker
  const store = useWorkspaceStore.getState();
    store.setHighlights([]);
    (store as any)._lastScrollRequest = null;

    if (suggestion === "Run Deep Analysis") {
      // Special case for analysis
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

          // Parse highlights and get clean content for display
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

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim() && !message.files?.length) return;

    setStatus("submitted");
    addUserMessage(message.text || "Attached files analysis");
    setText("");
  };

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden border-l border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-muted/30 text-foreground">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-foreground tracking-tight">
                Pro Architect
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-foreground/20 text-foreground/80 uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              Powered by Puter.js
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setMessages(initialMessages);
              const store = useWorkspaceStore.getState();
              store.setHighlights([]);
              (store as any)._lastScrollRequest = null;
            }}
            className="p-2 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-md transition-colors text-xs font-medium flex items-center gap-1.5 group"
          >
            <Trash2 className="w-3.5 h-3.5 group-hover:text-red-400 transition-colors" />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <Conversation>
        <ConversationContent className={messages.length === 0 ? "h-full" : ""}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 border border-border/40 shadow-sm backdrop-blur-sm mb-4">
                <Sparkles
                  className="h-6 w-6 text-foreground/70"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                How can I help you today?
              </p>
            </div>
          ) : (
            messages.map(({ versions, ...message }) => (
              <MessageBranch defaultBranch={0} key={message.key}>
                <MessageBranchContent>
                  {versions.map((version) => (
                    <Message from={message.from} key={version.id}>
                      <div>
                        {message.sources?.length && (
                          <Sources>
                            <SourcesTrigger count={message.sources.length} />
                            <SourcesContent>
                              {message.sources.map((source) => (
                                <Source
                                  href={source.href}
                                  key={source.href}
                                  title={source.title}
                                />
                              ))}
                            </SourcesContent>
                          </Sources>
                        )}
                        {message.reasoning && (
                          <Reasoning duration={message.reasoning.duration}>
                            <ReasoningTrigger />
                            <ReasoningContent>
                              {message.reasoning.content}
                            </ReasoningContent>
                          </Reasoning>
                        )}
                        <MessageContent>
                          {version.content ? (
                            <MessageResponse>{version.content}</MessageResponse>
                          ) : (
                            message.from === "assistant" && <MessageThinking />
                          )}
                        </MessageContent>
                      </div>
                    </Message>
                  ))}
                </MessageBranchContent>
                {versions.length > 1 && (
                  <MessageBranchSelector from={message.from}>
                    <MessageBranchPrevious />
                    <MessageBranchPage />
                    <MessageBranchNext />
                  </MessageBranchSelector>
                )}
              </MessageBranch>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions className="px-4">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
        <div className="w-full px-4 pb-4">
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputHeader>
              <PromptInputAttachmentsDisplay />
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(event) => setText(event.target.value)}
                value={text}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputButton
                  onClick={() => setUseMicrophone(!useMicrophone)}
                  variant={useMicrophone ? "default" : "ghost"}
                >
                  <MicIcon size={16} />
                  <span className="sr-only">Microphone</span>
                </PromptInputButton>
                <PromptInputButton
                  onClick={() => setUseWebSearch(!useWebSearch)}
                  variant={useWebSearch ? "default" : "ghost"}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton>
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo
                          provider={selectedModelData.chefSlug}
                        />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      {["OpenAI", "Anthropic", "Google"].map((chef) => (
                        <ModelSelectorGroup heading={chef} key={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelSelectorItem
                                key={m.id}
                                onSelect={() => {
                                  setModel(m.id);
                                  setModelSelectorOpen(false);
                                }}
                                value={m.id}
                              >
                                <ModelSelectorLogo provider={m.chefSlug} />
                                <ModelSelectorName>{m.name}</ModelSelectorName>
                                <ModelSelectorLogoGroup>
                                  {m.providers.map((provider) => (
                                    <ModelSelectorLogo
                                      key={provider}
                                      provider={provider}
                                    />
                                  ))}
                                </ModelSelectorLogoGroup>
                                {model === m.id ? (
                                  <CheckIcon className="ml-auto size-4" />
                                ) : (
                                  <div className="ml-auto size-4" />
                                )}
                              </ModelSelectorItem>
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={
                  !(text.trim() || status === "submitted") ||
                  status === "streaming"
                }
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};
