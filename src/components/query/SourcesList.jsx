'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card>
      {/* <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="cursor-pointer" asChild>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base">Sources</CardTitle>
                <Badge variant="secondary">{sources.length}</Badge>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-3">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50"
              >
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium">
                    {source.title || `Source ${index + 1}`}
                  </p>
                  {source.uri && (
                    <p className="text-xs text-muted-foreground truncate">
                      {source.uri}
                    </p>
                  )}
                  {source.chunk_id && (
                    <Badge variant="outline" className="text-xs">
                      Chunk: {source.chunk_id}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible> */}
    </Card>
  );
}
