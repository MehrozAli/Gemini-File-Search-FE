'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, RotateCcw } from 'lucide-react';

export function QueryInput({ onSubmit, isLoading, storeName, onClearChat, hasMessages }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && storeName) {
      onSubmit(query);
      setQuery(''); // Clear input after submission
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && storeName && !isLoading) {
        onSubmit(query);
        setQuery(''); // Clear input after submission
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Clear chat button - only show when there are messages */}
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
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !storeName}
            className="min-h-[60px] max-h-[200px] resize-none rounded-2xl"
            rows={1}
          />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || isLoading || !storeName}
          size="icon"
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
