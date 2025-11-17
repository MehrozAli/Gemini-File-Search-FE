'use client';

import { useId, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, RotateCcw } from 'lucide-react';

export function QueryInput({ onSubmit, isLoading, storeName, onClearChat, hasMessages }) {
  const [query, setQuery] = useState('');
  const hintId = useId();
  const canSubmit = Boolean(query.trim() && storeName && !isLoading);

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(query);
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="space-y-2">
      {hasMessages && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Clear conversation
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            aria-label="Your question"
            aria-describedby={hintId}
            placeholder="Ask about the documents in this store…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !storeName}
            className="min-h-[60px] max-h-[200px] resize-none rounded-2xl"
            rows={1}
          />
          <p id={hintId} className="sr-only">
            Press Enter to send, Shift+Enter for a new line.
          </p>
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          size="icon"
          aria-label="Send question"
          className="h-[60px] w-[60px] rounded-full shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
