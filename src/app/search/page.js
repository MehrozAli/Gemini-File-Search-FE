'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { useStoreConversation } from '@/lib/hooks/useQueryStore';
import { Card } from '@/components/ui/card';
import { StorePicker } from '@/components/stores/StorePicker';
import { QueryInput } from '@/components/query/QueryInput';
import { QueryResults } from '@/components/query/QueryResults';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const preselectedStore = searchParams.get('store');
  const { data: stores, isLoading } = useStores();
  const [chosenStore, setChosenStore] = useState(null);
  const selectedStore =
    chosenStore ?? (stores?.some((s) => s.name === preselectedStore) ? preselectedStore : '');
  const conversation = useStoreConversation(selectedStore);

  const handleStoreChange = (storeName) => {
    setChosenStore(storeName);
    conversation.clearConversation();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      <h1 className="sr-only">Ask a store</h1>
      {stores?.length > 0 && (
        <div className="shrink-0 border-b px-4 py-3 sm:max-w-md">
          <StorePicker
            id="search-store"
            label="Search in store"
            stores={stores}
            value={selectedStore}
            onChange={handleStoreChange}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-6 w-full max-w-md">
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      ) : !stores || stores.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <Search className="h-4 w-4" />
            <AlertDescription>
              No stores yet. Create a store and upload files before asking questions.
            </AlertDescription>
          </Alert>
        </div>
      ) : !selectedStore ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>Please select a store to search</p>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden">
            <QueryResults
              messages={conversation.messages}
              pendingPrompt={conversation.pendingPrompt}
              isLoading={conversation.isPending}
              error={conversation.error}
            />
          </div>

          <div className="shrink-0 border-t bg-background p-4">
            <QueryInput
              onSubmit={conversation.sendPrompt}
              isLoading={conversation.isPending}
              storeName={selectedStore}
              onClearChat={conversation.clearConversation}
              hasMessages={conversation.messages.length > 0}
            />
          </div>
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
          <h1 className="text-3xl font-semibold tracking-tight">Ask a store</h1>
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
