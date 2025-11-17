'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import { CheckCircle2, Copy, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SourcesList } from '@/components/query/SourcesList';
import { getErrorMessage } from '@/lib/utils/errorHandler';

const markdownComponents = {
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table {...props} />
    </div>
  ),
};

function Answer({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeHighlight]}
      components={markdownComponents}
    >
      {text}
    </ReactMarkdown>
  );
}

function UserBubble({ children }) {
  return (
    <div className="flex gap-3 justify-end">
      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{children}</p>
      </div>
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
        <User className="h-5 w-5 text-primary-foreground" />
      </div>
    </div>
  );
}

function ModelBubble({ children }) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center" aria-hidden="true">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 max-w-[85%] rounded-2xl px-4 py-3 bg-muted">{children}</div>
    </div>
  );
}

export function QueryResults({ messages = [], pendingPrompt = null, isLoading, error }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [messages, pendingPrompt]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Response copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Could not copy to the clipboard');
    }
  };

  if (messages.length === 0 && !pendingPrompt && !error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground max-w-md">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">Start a conversation</h3>
          <p className="text-sm">Ask a question about the documents in this store.</p>
          <p className="text-xs mt-2">Follow-up questions keep the earlier answers as context.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <ol className="space-y-6 max-w-3xl mx-auto" aria-label="Conversation" aria-live="polite">
        {messages.map((message, index) => (
          <li key={index}>
            {message.role === 'user' ? (
              <UserBubble>{message.content}</UserBubble>
            ) : (
              <ModelBubble>
                <div className="markdown-content text-sm">
                  <Answer text={message.content} />
                </div>
                <SourcesList sources={message.sources} />
                <div className="flex justify-end mt-2 pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    aria-label="Copy answer"
                    onClick={() => handleCopy(message.content, index)}
                  >
                    {copiedIndex === index ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </ModelBubble>
            )}
          </li>
        ))}

        {pendingPrompt && (
          <li>
            <UserBubble>{pendingPrompt}</UserBubble>
          </li>
        )}

        {isLoading && (
          <li>
            <ModelBubble>
              <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Searching the store…</span>
              </div>
              <Skeleton className="h-3 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-5/6" />
            </ModelBubble>
          </li>
        )}

        {error && !isLoading && (
          <li>
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(error, 'Failed to get results. Please try again.')}
              </AlertDescription>
            </Alert>
          </li>
        )}
      </ol>
      <div ref={messagesEndRef} />
    </div>
  );
}
