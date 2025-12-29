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
import { CheckCircle2, Copy, Trash2, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import 'highlight.js/styles/github-dark.css';

export function QueryResults({ data, isLoading, error, conversationHistory = [], onClearConversation }) {
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when conversation history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [conversationHistory]);

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

  // Show empty state if no conversation
  if (!data && conversationHistory.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground max-w-md">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
          <p className="text-sm">Ask questions about your documents and I&apos;ll help you find answers.</p>
          <p className="text-xs mt-2 opacity-70">Your conversation context is maintained for better results.</p>
        </div>
      </div>
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
    <div className="h-full flex flex-col">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Error message if exists */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error.response?.data?.detail || 'Failed to get results. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'model' && (
                <div className="shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                </div>
              )}
              <div
                className={`flex-1 max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                    {renderMarkdown(message.content)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                  <span className="text-xs opacity-60">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 opacity-60 hover:opacity-100"
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
                <div className="shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Show loading state for current query */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
              <div className="flex-1 max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          )}
          
          {/* Invisible element at the bottom for scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

