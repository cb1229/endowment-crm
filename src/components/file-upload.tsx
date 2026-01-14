'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FileUploadProps {
  entityType?: 'firm' | 'fund' | 'company';
  entityId?: string;
  noteId?: string;
  onUploadComplete?: () => void;
}

interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  createdAt: string;
}

export function FileUpload({ entityType, entityId, noteId, onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Fetch existing files
  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams();
      if (entityType && entityId) {
        params.append('entityType', entityType);
        params.append('entityId', entityId);
      }
      if (noteId) {
        params.append('noteId', noteId);
      }

      const response = await fetch(`/api/files?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(selectedFiles)) {
        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${entityType || 'notes'}/${entityId || noteId}/${timestamp}_${sanitizedName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save file metadata to database
        const metadata = {
          fileName: file.name,
          filePath,
          fileSize: file.size,
          fileType: file.type,
          entityType: entityType || null,
          entityId: entityId || null,
          noteId: noteId || null,
        };

        const response = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metadata),
        });

        if (!response.ok) throw new Error('Failed to save file metadata');
      }

      // Refresh files list
      await fetchFiles();
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      await supabase.storage.from('attachments').remove([filePath]);

      // Delete metadata
      await fetch(`/api/files/${fileId}`, { method: 'DELETE' });

      // Refresh list
      setFiles(files.filter(f => f.id !== fileId));
      onUploadComplete?.();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-4">
          Loading files...
        </div>
      ) : files.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-4">
          No files uploaded yet
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(file.filePath, file.fileName)}
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(file.id, file.filePath)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
