'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { CheckCircle2, Copy, Trash2, MessageSquare, Bot, User } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import 'highlight.js/styles/github-dark.css';

export function QueryResults({ data, isLoading, error, conversationHistory = [], onClearConversation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Response copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      onClearConversation?.();
      toast.success('Conversation cleared');
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error.response?.data?.detail || 'Failed to get results. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  // If no conversation history and no current data, show empty state
  if (!data && conversationHistory.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Enter a question above to search your documents.</p>
          <p className="text-xs mt-2">Your conversation will be maintained for context.</p>
        </div>
      </Card>
    );
  }

  const renderMarkdown = (text) => (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        // Custom table rendering for better styling
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table {...props} />
          </div>
        ),
        // Enhanced code block rendering
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <code className={className} {...props}>
              {children}
            </code>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Enhanced blockquote rendering
        blockquote: ({ node, children, ...props }) => (
          <blockquote {...props}>
            {children}
          </blockquote>
        ),
        // Enhanced heading rendering with proper IDs
        h1: ({ node, children, ...props }) => (
          <h1 id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
            {children}
          </h1>
        ),
        h2: ({ node, children, ...props }) => (
          <h2 id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
            {children}
          </h2>
        ),
        h3: ({ node, children, ...props }) => (
          <h3 id={String(children).toLowerCase().replace(/\s+/g, '-')} {...props}>
            {children}
          </h3>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-semibold">Conversation</h3>
            {conversationHistory.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({conversationHistory.length} messages)
              </span>
            )}
          </div>
          {conversationHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearConversation}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <Separator />

        {/* Display conversation history */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'model' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
              <div
                className={`flex-1 max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                    {renderMarkdown(message.content)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => handleCopy(message.content)}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Show loading state for current query */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>
              <div className="flex-1 max-w-[80%] rounded-lg p-4 bg-muted">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          )}
        </div>

        {data?.sources && data.sources.length > 0 && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground">
              Last response based on {data.sources.length} source{data.sources.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
