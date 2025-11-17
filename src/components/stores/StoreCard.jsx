'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Database, Search, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useDeleteStore, useSyncStore } from '@/lib/hooks/useStores';
import { DeleteSingleStoreDialog } from './DeleteSingleStoreDialog';
import { formatDate } from '@/lib/format';

export function StoreCard({ store }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteStore = useDeleteStore();
  const syncStore = useSyncStore();

  const createdDate = formatDate(store.create_time, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Gemini store names contain a '/', e.g. "fileSearchStores/abc123".
  const encodedStoreName = encodeURIComponent(store.name);

  const handleDelete = () => {
    deleteStore.mutate(store.name, { onSuccess: () => setShowDeleteDialog(false) });
  };

  const handleSync = () => {
    syncStore.mutate({
      storeName: store.name,
      displayName: store.display_name || '',
      documentName: '',
    });
  };

  const isSyncing = syncStore.isPending;
  const isCardDisabled = isSyncing || deleteStore.isPending;

  return (
    <>
      <Card className={`hover:shadow-md transition-all ${isCardDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{store.display_name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isSyncing && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Spinner className="h-3 w-3" />
                  Syncing...
                </Badge>
              )}
              {!isSyncing && <Badge variant="outline">{store.state}</Badge>}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isCardDisabled}
                aria-label={`Delete ${store.display_name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="space-y-1">
            <div className="text-xs">Store: {store.name}</div>
            <div className="text-xs">Created: {createdDate}</div>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isCardDisabled}
          >
            {isSyncing ? (
              <Spinner className="h-4 w-4 mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync
          </Button>
          <Button asChild variant="outline" size="sm" disabled={isCardDisabled}>
            <Link href={`/search?store=${encodedStoreName}`}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <DeleteSingleStoreDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        storeName={store.display_name}
        isDeleting={deleteStore.isPending}
      />
    </>
  );
}
