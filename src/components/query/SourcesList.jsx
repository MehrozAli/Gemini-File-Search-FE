'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

export function SourcesList({ sources }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="p-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between h-auto p-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sources</span>
            <Badge variant="secondary" className="h-5 text-xs">{sources.length}</Badge>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-2">
        <div className="space-y-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 rounded-lg border bg-background text-xs"
            >
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {source.title || `Source ${index + 1}`}
                </p>
                {source.uri && (
                  <p className="text-muted-foreground truncate">
                    {source.uri}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
