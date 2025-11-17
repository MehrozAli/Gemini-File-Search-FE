'use client';

import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpload } from '@/lib/hooks/useUpload';

export function FileUploader({ storeName, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: upload, isPending, uploadProgress } = useUpload();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !storeName) return;

    upload(
      { storeName, file: selectedFile },
      {
        onSuccess: () => {
          setSelectedFile(null);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          isPending && 'pointer-events-none opacity-50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div>
              <p className="text-sm font-medium">
                Drag and drop your file here, or
              </p>
              <label className="text-sm text-primary hover:underline cursor-pointer">
                browse files
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isPending}
                />
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              Supports PDF, TXT, DOC, DOCX and other document formats
            </p>
          </div>
        </div>
      </Card>

      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <File className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {!isPending && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isPending && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {!isPending && (
            <Button
              onClick={handleUpload}
              className="w-full mt-4"
              disabled={!storeName}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
