'use client';

import { useState } from 'react';
import { useStores } from '@/lib/hooks/useStores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StoreList } from '@/components/stores/StoreList';
import { CreateStoreModal } from '@/components/stores/CreateStoreModal';
import { Database, Upload, Search, Plus } from 'lucide-react';

export default function Home() {
  const { data: stores, isLoading, error } = useStores();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    {
      title: 'Total Stores',
      value: stores?.length || 0,
      icon: Database,
      description: 'Active file search stores',
    },
    {
      title: 'Recent Activity',
      value: stores?.filter(s => {
        const created = new Date(s.create_time);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return created > dayAgo;
      }).length || 0,
      icon: Upload,
      description: 'Stores created today',
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your file search stores and query documents with AI
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Store
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Your Stores</h2>
        </div>
        <StoreList stores={stores} isLoading={isLoading} error={error} />
      </div>

      <CreateStoreModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
