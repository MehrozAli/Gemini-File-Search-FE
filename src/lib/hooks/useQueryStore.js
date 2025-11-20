'use client';

import { useMutation } from '@tanstack/react-query';
import { queryStore } from '../api/queries';
import { toast } from 'sonner';

/**
 * Hook to query a store
 */
export function useQuery() {
  return useMutation({
    mutationFn: ({ storeName, prompt, system_prompt, model }) => 
      queryStore(storeName, { 
        prompt, 
        ...(system_prompt && { system_prompt }),
        ...(model && { model })
      }),
    onError: (error) => {
      const message = error.response?.data?.detail || 'Query failed';
      toast.error(message);
    },
  });
}
