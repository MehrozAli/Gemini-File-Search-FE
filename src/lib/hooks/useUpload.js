'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../api/files';
import { QUERY_KEYS } from '../config';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Hook to upload files to a store
 */
export function useUpload() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ storeName, file }) =>
      uploadFile(storeName, file, setUploadProgress),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      setUploadProgress(0);
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Failed to upload file');
      toast.error(message);
      setUploadProgress(0);
    },
  });

  return {
    ...mutation,
    uploadProgress,
  };
}
