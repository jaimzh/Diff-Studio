import type { ToolUIPart } from "ai";

export interface MessageType {
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

export interface Model {
  id: string;
  name: string;
  chef: string;
  chefSlug: string;
  providers: string[];
}
