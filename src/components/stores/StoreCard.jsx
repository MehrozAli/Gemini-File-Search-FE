'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDeleteStore } from '@/lib/hooks/useStores';
import { DeleteSingleStoreDialog } from './DeleteSingleStoreDialog';

export function StoreCard({ store }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteStore = useDeleteStore();

  const createdDate = new Date(store.create_time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // URL encode the store name to handle special characters like '/'
  const encodedStoreName = encodeURIComponent(store.name);

  const handleDelete = async () => {
    await deleteStore.mutateAsync(store.name);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{store.display_name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{store.state}</Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/stores/${encodedStoreName}`}>
              <Database className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/upload?store=${encodedStoreName}`}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
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
