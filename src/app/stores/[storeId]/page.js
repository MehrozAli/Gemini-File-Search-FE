'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { useQuery as useQueryStore } from '@/lib/hooks/useQueryStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploader } from '@/components/upload/FileUploader';
import { QueryInput } from '@/components/query/QueryInput';
import { QueryResults } from '@/components/query/QueryResults';
import { SourcesList } from '@/components/query/SourcesList';
import { Database } from 'lucide-react';

export default function StoreDetailPage() {
  const params = useParams();
  // Decode the URL-encoded store ID
  const storeId = decodeURIComponent(params.storeId);
  const { data: stores, isLoading: storesLoading } = useStores();
  const { mutate: query, data: queryData, isPending: isQuerying, error: queryError } = useQueryStore();
  const [activeTab, setActiveTab] = useState('upload');

  const store = stores?.find((s) => s.name === storeId);

  const handleQuery = (prompt) => {
    query({ storeName: storeId, prompt });
  };

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

  const createdDate = new Date(store.create_time).toLocaleString('en-US', {
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
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-muted-foreground" />
              <div>
                <CardTitle className="text-2xl">{store.display_name}</CardTitle>
                <CardDescription className="space-y-1 mt-2">
                  <div className="text-sm">Store ID: {store.name}</div>
                  <div className="text-sm">Created: {createdDate}</div>
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
          
          <QueryInput
            onSubmit={handleQuery}
            isLoading={isQuerying}
            storeName={storeId}
          />

          <QueryResults
            data={queryData}
            isLoading={isQuerying}
            error={queryError}
          />

          {queryData?.sources && queryData.sources.length > 0 && (
            <SourcesList sources={queryData.sources} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
