'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStores, createStore, deleteAllStores, deleteStore, syncStore, checkHealth } from '../api/stores';
import { QUERY_KEYS } from '../config';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/errorHandler';

export function useStores() {
  return useQuery({
    queryKey: QUERY_KEYS.stores,
    queryFn: getStores,
    staleTime: 30_000,
  });
}

function useStoreMutation({ mutationFn, success, failure }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      toast.success(success);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, failure));
    },
  });
}

export function useCreateStore() {
  return useStoreMutation({
    mutationFn: createStore,
    success: 'Store created successfully!',
    failure: 'Failed to create store',
  });
}

export function useDeleteStore() {
  return useStoreMutation({
    mutationFn: deleteStore,
    success: 'Store deleted successfully!',
    failure: 'Failed to delete store',
  });
}

export function useDeleteAllStores() {
  return useStoreMutation({
    mutationFn: deleteAllStores,
    success: 'All stores deleted successfully!',
    failure: 'Failed to delete stores',
  });
}

export function useSyncStore() {
  return useStoreMutation({
    mutationFn: ({ storeName, displayName, documentName }) =>
      syncStore(storeName, displayName, documentName),
    success: 'Store synced successfully!',
    failure: 'Failed to sync store',
  });
}

export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: checkHealth,
    staleTime: 60_000,
    retry: 3,
  });
}
