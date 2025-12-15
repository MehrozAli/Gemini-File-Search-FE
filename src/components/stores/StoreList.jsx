'use client';

import { useState } from 'react';
import { StoreCard } from './StoreCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database } from 'lucide-react';

export function StoreList({ stores, isLoading, error }) {
  const [syncingStores, setSyncingStores] = useState(new Set());
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load stores. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Database className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Get started by creating your first file search store.
        </p>
      </div>
    );
  }

  const handleSyncStart = (storeName) => {
    setSyncingStores(prev => new Set(prev).add(storeName));
  };

  const handleSyncEnd = (storeName) => {
    setSyncingStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(storeName);
      return newSet;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => (
        <StoreCard
          key={store.name}
          store={store}
          isSyncing={syncingStores.has(store.name)}
          onSyncStart={handleSyncStart}
          onSyncEnd={handleSyncEnd}
        />
      ))}
    </div>
  );
}
