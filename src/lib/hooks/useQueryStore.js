'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryStore } from '../api/queries';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/errorHandler';
import { getSavedSystemPrompt } from '../systemPrompt';

// Ten messages is five question/answer pairs: enough context for
// follow-up questions without growing every request without bound.
export const MAX_HISTORY_MESSAGES = 10;

export function useAskStore() {
  return useMutation({
    mutationFn: ({ storeName, prompt, system_prompt, model, conversation_history }) =>
      queryStore(storeName, {
        prompt,
        ...(system_prompt && { system_prompt }),
        ...(model && { model }),
        ...(conversation_history?.length > 0 && { conversation_history }),
      }),
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Query failed'));
    },
  });
}

export function useStoreConversation(storeName) {
  const [messages, setMessages] = useState([]);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const ask = useAskStore();

  const sendPrompt = (prompt) => {
    if (!storeName || !prompt.trim()) return;

    const conversation_history = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content }) => ({ role, content }));

    // Stays visible after a failure so the question is not lost.
    setPendingPrompt(prompt);
    ask.mutate(
      { storeName, prompt, system_prompt: getSavedSystemPrompt(), conversation_history },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: prompt },
            { role: 'model', content: data.text ?? '', sources: data.sources ?? [] },
          ]);
          setPendingPrompt(null);
        },
      }
    );
  };

  const clearConversation = () => {
    setMessages([]);
    setPendingPrompt(null);
    ask.reset();
  };

  return {
    messages,
    pendingPrompt,
    sendPrompt,
    clearConversation,
    isPending: ask.isPending,
    error: ask.error,
  };
}
