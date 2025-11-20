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
import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import 'highlight.js/styles/github-dark.css';

export function QueryResults({ data, isLoading, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data?.answer) {
      navigator.clipboard.writeText(data.answer);
      setCopied(true);
      toast.success('Response copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
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

  if (!data) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>Enter a question above to search your documents.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Response</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        <Separator />

        <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
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
            {data.text}
          </ReactMarkdown>
        </div>

        {data.sources && data.sources.length > 0 && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground">
              Based on {data.sources.length} source{data.sources.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
