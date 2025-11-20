'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStores, createStore, deleteAllStores, deleteStore, checkHealth } from '../api/stores';
import { QUERY_KEYS } from '../config';
import { toast } from 'sonner';

/**
 * Hook to fetch all stores
 */
export function useStores() {
  return useQuery({
    queryKey: QUERY_KEYS.stores,
    queryFn: getStores,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to create a new store
 */
export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      toast.success('Store created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to create store';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a single store
 */
export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      toast.success('Store deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to delete store';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete all stores
 */
export function useDeleteAllStores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllStores,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      toast.success('All stores deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to delete stores';
      toast.error(message);
    },
  });
}

/**
 * Hook to check API health
 */
export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: checkHealth,
    staleTime: 60000, // 1 minute
    retry: 3,
  });
}
