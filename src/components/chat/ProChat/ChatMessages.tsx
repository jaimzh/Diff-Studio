import React from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "../ai-elements/conversation";
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
} from "../ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "../ai-elements/sources";
import { Sparkles } from "lucide-react";
import { type MessageType } from "./types";

interface ChatMessagesProps {
  messages: MessageType[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
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
  );
};
