'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { Card } from '@/components/ui/card';
import { StorePicker } from '@/components/stores/StorePicker';
import { FileUploader } from '@/components/upload/FileUploader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';

function UploadPageContent() {
  const searchParams = useSearchParams();
  const preselectedStore = searchParams.get('store');
  const { data: stores, isLoading } = useStores();
  const [chosenStore, setChosenStore] = useState(null);
  const selectedStore =
    chosenStore ?? (stores?.some((s) => s.name === preselectedStore) ? preselectedStore : '');

  return (
    <div className="container py-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Files</h1>
        <p className="text-muted-foreground mt-2">
          Upload documents to a store to make them searchable
        </p>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : !stores || stores.length === 0 ? (
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            No stores available. Please create a store first before uploading files.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="p-6 space-y-6">
          <StorePicker
            id="upload-store"
            label="Upload to store"
            stores={stores}
            value={selectedStore}
            onChange={setChosenStore}
          />
          {selectedStore && <FileUploader storeName={selectedStore} />}
        </Card>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="container py-8 space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Files</h1>
          <p className="text-muted-foreground mt-2">
            Upload documents to a store to make them searchable
          </p>
        </div>
        <Card className="p-6">
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}
