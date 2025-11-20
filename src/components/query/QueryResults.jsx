'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

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

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
