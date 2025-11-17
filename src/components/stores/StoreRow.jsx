'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareText, RefreshCw, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteStore, useSyncStore } from '@/lib/hooks/useStores';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { DeleteSingleStoreDialog } from './DeleteSingleStoreDialog';

export function StoreRow({ store }) {
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
  const isBusy = isSyncing || deleteStore.isPending;

  return (
    <li
      className={cn(
        'grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center',
        isBusy && 'opacity-60'
      )}
      aria-busy={isBusy}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/stores/${encodedStoreName}`}
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline truncate"
          >
            {store.display_name || store.name}
          </Link>
          {isSyncing ? (
            <Badge variant="secondary" className="gap-1">
              <Spinner className="h-3 w-3" />
              Syncing
            </Badge>
          ) : (
            store.state && <Badge variant="outline">{store.state}</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono break-all">{store.name}</span>
          <span aria-hidden="true"> · </span>
          <span>Created {createdDate}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="default" size="sm">
          <Link href={`/search?store=${encodedStoreName}`}>
            <MessageSquareText className="h-4 w-4" />
            Search
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/upload?store=${encodedStoreName}`}>
            <Upload className="h-4 w-4" />
            Upload
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleSync} disabled={isBusy}>
          {isSyncing ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          Sync
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isBusy}
          aria-label={`Delete ${store.display_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <DeleteSingleStoreDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        storeName={store.display_name}
        isDeleting={deleteStore.isPending}
      />
    </li>
  );
}
