'use client';

import { StoreRow } from './StoreRow';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Library } from 'lucide-react';

export function StoreList({ stores, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card divide-y" aria-busy="true" aria-label="Loading stores">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-5 py-4 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load stores. Check that the FastAPI backend is running and NEXT_PUBLIC_API_URL
          points at it.
        </AlertDescription>
      </Alert>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-16 px-4 text-center">
        <Library className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
        <p className="text-muted-foreground max-w-sm">
          A store holds the documents Gemini searches. Create one, then upload files to it.
        </p>
      </div>
    );
  }

  return (
    <ul className="rounded-lg border bg-card divide-y">
      {stores.map((store) => (
        <StoreRow key={store.name} store={store} />
      ))}
    </ul>
  );
}
