'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { useStoreConversation } from '@/lib/hooks/useQueryStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploader } from '@/components/upload/FileUploader';
import { QueryInput } from '@/components/query/QueryInput';
import { QueryResults } from '@/components/query/QueryResults';
import { Database } from 'lucide-react';
import { formatDate } from '@/lib/format';

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = decodeURIComponent(params.storeId);
  const { data: stores, isLoading: storesLoading } = useStores();
  const conversation = useStoreConversation(storeId);
  const [activeTab, setActiveTab] = useState('upload');

  const store = stores?.find((s) => s.name === storeId);

  if (storesLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container py-8">
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Store not found</h2>
            <p className="text-muted-foreground mt-2">
              The store you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const createdDate = formatDate(store.create_time, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Database className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <CardTitle>
                  <h1 className="text-2xl font-semibold">{store.display_name}</h1>
                </CardTitle>
                <CardDescription className="mt-2 space-y-1 text-sm">
                  <span className="block font-mono break-all">{store.name}</span>
                  <span className="block">Created {createdDate}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {store.state}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="query">Query Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload files to this store to make them searchable
            </p>
          </div>
          <FileUploader storeName={storeId} />
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Search Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask questions about your uploaded documents
            </p>
          </div>

          <QueryResults
            messages={conversation.messages}
            pendingPrompt={conversation.pendingPrompt}
            isLoading={conversation.isPending}
            error={conversation.error}
          />

          <QueryInput
            onSubmit={conversation.sendPrompt}
            isLoading={conversation.isPending}
            storeName={storeId}
            onClearChat={conversation.clearConversation}
            hasMessages={conversation.messages.length > 0}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
