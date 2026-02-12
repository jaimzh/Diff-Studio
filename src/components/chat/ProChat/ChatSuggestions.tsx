import React from "react";
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { suggestions as suggestionList } from "./constants";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  onSuggestionClick,
}) => {
  return (
    <Suggestions className="px-4">
      {suggestionList.map((suggestion) => (
        <Suggestion
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          suggestion={suggestion}
        />
      ))}
    </Suggestions>
  );
};
