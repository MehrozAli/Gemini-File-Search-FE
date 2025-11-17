'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../api/files';
import { QUERY_KEYS } from '../config';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/errorHandler';

export function useUpload() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ storeName, file }) => uploadFile(storeName, file, setUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stores });
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to upload file'));
    },
    onSettled: () => setUploadProgress(0),
  });

  return {
    ...mutation,
    uploadProgress,
  };
}
