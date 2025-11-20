'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';

export function QueryInput({ onSubmit, isLoading, storeName }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && storeName) {
      onSubmit(query);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="query">Enter your question</Label>
          <div className="relative">
            <Textarea
              id="query"
              placeholder="Ask a question about your documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading || !storeName}
              className="min-h-[120px] resize-none"
            />
            {query && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {query.length} characters
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!query.trim() || isLoading || !storeName}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
