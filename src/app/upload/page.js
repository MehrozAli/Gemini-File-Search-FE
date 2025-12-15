'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStores } from '@/lib/hooks/useStores';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUploader } from '@/components/upload/FileUploader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';

function UploadPageContent() {
  const searchParams = useSearchParams();
  const preselectedStoreParam = searchParams.get('store');
  // Decode the URL-encoded store name if present
  const preselectedStore = preselectedStoreParam ? decodeURIComponent(preselectedStoreParam) : null;
  const { data: stores, isLoading } = useStores();
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    if (preselectedStore && stores?.find((s) => s.name === preselectedStore)) {
      setSelectedStore(preselectedStore);
    }
  }, [preselectedStore, stores]);

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
      <></>
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
