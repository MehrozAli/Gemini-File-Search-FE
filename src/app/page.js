'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareText, Plus, Upload } from 'lucide-react';
import { useStores } from '@/lib/hooks/useStores';
import { Button } from '@/components/ui/button';
import { StoreList } from '@/components/stores/StoreList';
import { CreateStoreModal } from '@/components/stores/CreateStoreModal';
import { countStoresCreatedSince } from '@/lib/storeStats';

export default function Home() {
  const { data: stores, isLoading, error } = useStores();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { label: 'Stores', value: stores?.length ?? 0 },
    { label: 'Created in the last 24 hours', value: countStoresCreatedSince(stores) },
  ];

  return (
    <div className="container py-8 sm:py-10 space-y-10">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Gemini file search</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your document stores</h1>
          <p className="text-muted-foreground max-w-xl">
            Each store is a Gemini file search index. Upload documents to a store, then ask
            questions and get answers with the passages they came from.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            New store
          </Button>
          <Button asChild variant="outline">
            <Link href="/upload">
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">
              <MessageSquareText className="h-4 w-4" />
              Ask
            </Link>
          </Button>
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:max-w-md">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="font-serif text-2xl font-semibold tabular-nums">
              {isLoading ? '–' : stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="stores-heading" className="space-y-4">
        <h2 id="stores-heading" className="text-xl font-semibold tracking-tight">
          Stores
        </h2>
        <StoreList stores={stores} isLoading={isLoading} error={error} />
      </section>

      <CreateStoreModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
