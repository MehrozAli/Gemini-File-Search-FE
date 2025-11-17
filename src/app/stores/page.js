'use client';

import { useState } from 'react';
import { useStores } from '@/lib/hooks/useStores';
import { Button } from '@/components/ui/button';
import { StoreList } from '@/components/stores/StoreList';
import { CreateStoreModal } from '@/components/stores/CreateStoreModal';
import { DeleteStoreDialog } from '@/components/stores/DeleteStoreDialog';
import { Plus, Trash2 } from 'lucide-react';

export default function StoresPage() {
  const { data: stores, isLoading, error } = useStores();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Stores</h1>
          <p className="text-muted-foreground mt-2">
            Create, sync and delete Gemini file search stores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {stores && stores.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete all
            </Button>
          )}
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            New store
          </Button>
        </div>
      </div>

      <StoreList stores={stores} isLoading={isLoading} error={error} />

      <CreateStoreModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <DeleteStoreDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}
