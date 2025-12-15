'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { useQuery as useQueryStore } from '@/lib/hooks/useQueryStore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueryInput } from '@/components/query/QueryInput';
import { QueryResults } from '@/components/query/QueryResults';
import { SourcesList } from '@/components/query/SourcesList';
import { SystemPromptSettings, getSavedSystemPrompt } from '@/components/query/SystemPromptSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const preselectedStoreParam = searchParams.get('store');
  // Decode the URL-encoded store name if present
  const preselectedStore = preselectedStoreParam ? decodeURIComponent(preselectedStoreParam) : null;
  const { data: stores, isLoading } = useStores();
  const [selectedStore, setSelectedStore] = useState('');
  const { mutate: query, data: queryData, isPending: isQuerying, error: queryError } = useQueryStore();

  useEffect(() => {
    if (preselectedStore && stores?.find((s) => s.name === preselectedStore)) {
      setSelectedStore(preselectedStore);
    }
  }, [preselectedStore, stores]);

  const handleQuery = (prompt) => {
    if (selectedStore) {
      const systemPrompt = getSavedSystemPrompt();
      query({ 
        storeName: selectedStore, 
        prompt,
        ...(systemPrompt && { system_prompt: systemPrompt })
      });
    }
  };

  return (
    <div className="container py-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Documents</h1>
        <p className="text-muted-foreground mt-2">
          Query your uploaded documents with AI-powered search
        </p>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : !stores || stores.length === 0 ? (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>
            No stores available. Please create a store and upload files first.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* <Card className="p-6">
            <div className="space-y-2">
              <Label htmlFor="store-select">Select Store</Label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger id="store-select">
                  <SelectValue placeholder="Choose a store..." />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.name} value={store.name}>
                      {store.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStore && (
                <p className="text-xs text-muted-foreground">
                  Store ID: {selectedStore}
                </p>
              )}
            </div>
          </Card> */}

          {!selectedStore ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Please select a store to search</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <SystemPromptSettings />
              
              <QueryInput
                onSubmit={handleQuery}
                isLoading={isQuerying}
                storeName={selectedStore}
              />

              <QueryResults
                data={queryData}
                isLoading={isQuerying}
                error={queryError}
              />

              {queryData?.sources && queryData.sources.length > 0 && (
                <SourcesList sources={queryData.sources} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-8 space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Documents</h1>
          <p className="text-muted-foreground mt-2">
            Query your uploaded documents with AI-powered search
          </p>
        </div>
        <Card className="p-6">
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
