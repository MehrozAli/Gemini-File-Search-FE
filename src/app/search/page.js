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
// import { SourcesList } from '@/components/query/SourcesList';
import { getSavedSystemPrompt } from '@/components/query/SystemPromptSettings';
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
  const [conversationHistory, setConversationHistory] = useState([]);
  const { mutate: query, data: queryData, isPending: isQuerying, error: queryError } = useQueryStore();

  useEffect(() => {
    if (preselectedStore && stores?.find((s) => s.name === preselectedStore)) {
      setSelectedStore(preselectedStore);
    }
  }, [preselectedStore, stores]);

  // Reset conversation when store changes
  useEffect(() => {
    setConversationHistory([]);
  }, [selectedStore]);

  const handleQuery = (prompt) => {
    if (selectedStore) {
      const systemPrompt = getSavedSystemPrompt();
      
      // Add user message to history
      const userMessage = { role: 'user', content: prompt };
      
      // Prepare history for backend (last 10 messages to keep context manageable)
      const recentHistory = conversationHistory.slice(-10);
      
      query({ 
        storeName: selectedStore, 
        prompt,
        ...(systemPrompt && { system_prompt: systemPrompt }),
        conversation_history: recentHistory
      }, {
        onSuccess: (data) => {
          // Add both user message and model response to conversation history
          const modelMessage = { role: 'model', content: data.text };
          setConversationHistory(prev => [...prev, userMessage, modelMessage]);
        }
      });
    }
  };

  const handleClearConversation = () => {
    setConversationHistory([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">

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
              No stores available. Please create a store and upload files first.
            </AlertDescription>
          </Alert>
        </div>
      ) : !selectedStore ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please select a store to search</p>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-hidden">
            <QueryResults
              data={queryData}
              isLoading={isQuerying}
              error={queryError}
              conversationHistory={conversationHistory}
              onClearConversation={handleClearConversation}
            />
          </div>

          {/* Sources - Collapsible above input */}
          {/* {queryData?.sources && queryData.sources.length > 0 && (
            <div className="flex-shrink-0 border-t bg-muted/30 max-h-32 overflow-y-auto">
              <SourcesList sources={queryData.sources} />
            </div>
          )} */}

          {/* Input at Bottom - Fixed */}
          <div className="shrink-0 border-t bg-background p-4">
            <QueryInput
              onSubmit={handleQuery}
              isLoading={isQuerying}
              storeName={selectedStore}
              onClearChat={handleClearConversation}
              hasMessages={conversationHistory.length > 0}
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
