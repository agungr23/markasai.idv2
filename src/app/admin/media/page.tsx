'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Image as ImageIcon,
  File,
  Download,
  Filter,
  Grid,
  List
} from 'lucide-react';

// Media statis dihilangkan - hanya tampilkan file yang diupload via CMS

export default function AdminMediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  interface MediaFile {
    id: string;
    name: string;
    url: string;
    deletable?: boolean;
    type: 'image' | 'video' | 'other';
    isStatic?: boolean;
    size?: number;
    dimensions?: string;
    uploadedAt?: string;
  }
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);

  // Load uploaded files from API on component mount
  useEffect(() => {
    console.log('🔄 Loading media files on page load...');
    loadUploadedFiles();
    
    // Also run synchronization automatically on page load
    setTimeout(() => {
      console.log('🔄 Auto-running synchronization on page load...');
      syncMediaFiles(true); // Pass true for auto-sync
    }, 1000); // Wait 1 second after initial load
    
    // Set up automatic synchronization every 2 minutes
    const syncInterval = setInterval(() => {
      console.log('🔄 Auto-sync: Running periodic synchronization...');
      syncMediaFiles(true); // Pass true for auto-sync
    }, 120000); // 2 minutes
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  const loadUploadedFiles = async () => {
    setIsRefreshing(true);
    try {
      console.log('🚀 Fetching media files from API...');

      // Add cache buster to ensure fresh data
      const timestamp = Date.now();
      const response = await fetch(`/api/media?t=${timestamp}`);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw API response:', data);
        const files = data.files || [];

        // Clear existing state first to prevent stale data
        setUploadedFiles([]);

        // Then set new data
        setTimeout(() => {
          setUploadedFiles(files);
          console.log('✅ Loaded', files.length, 'uploaded files:', files.map((f: MediaFile) => f.name));
        }, 100);
      } else {
        console.error('❌ API response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Failed to load uploaded files:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Hanya gunakan file yang diupload via CMS
  const filteredFiles = uploadedFiles.filter(file => {
    return file.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFileUpload = async (fileList: FileList | File[]) => {
    console.log('Starting upload for', fileList.length, 'files');
    setIsUploading(true);

    try {
      const uploadedResults: MediaFile[] = [];

      // Upload files one by one
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append('file', file); // Use 'file' to match API expectation

        console.log('Uploading file:', file.name, 'size:', file.size);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Upload failed for', file.name, ':', result);
          throw new Error(result.error || `Upload failed for ${file.name}`);
        }

        if (result.success && result.file) {
          uploadedResults.push(result.file);
          console.log('✅ File uploaded successfully:', result.file.name);
        } else {
          throw new Error(result.error || `Upload failed for ${file.name}`);
        }
      }

      // Add uploaded files to state AND reload from server to ensure consistency
      if (uploadedResults.length > 0) {
        console.log('✅ Upload successful! Reloading media list to ensure consistency...');

        // Reload fresh data from server instead of just updating state
        await loadUploadedFiles();

        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(`Upload gagal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files?.length, 'files');
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
      // Reset input to allow same file upload again
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show temporary success message
    const originalText = document.querySelector(`[data-url="${url}"]`)?.textContent;
    const button = document.querySelector(`[data-url="${url}"]`) as HTMLElement;
    if (button) {
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText || 'Copy URL';
      }, 2000);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const deleteFiles = async (fileIds: string[]) => {
    try {
      console.log('🗑️ Deleting files:', fileIds);

      // Delete files from server
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Files deleted from server:', result.deletedFiles);

        // Reload fresh data from server instead of just updating state
        await loadUploadedFiles();
        setSelectedFiles([]);

        // Show success message
        alert(`${result.deletedFiles.length} file(s) berhasil dihapus!`);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert('Gagal menghapus file. Silakan coba lagi.');
    }
  };

  const deleteSelectedFiles = () => {
    if (selectedFiles.length > 0) {
      // Only delete files that are deletable
      const deletableFiles = selectedFiles.filter(fileId => {
        const file = filteredFiles.find(f => f.id === fileId);
        return file && file.deletable !== false;
      });

      if (deletableFiles.length > 0) {
        deleteFiles(deletableFiles);
      } else {
        alert('File yang dipilih tidak bisa dihapus (file static)');
      }
    }
  };

  const syncMediaFiles = async (isAutoSync = false) => {
    if (!isAutoSync) setIsSyncing(true); // Only show loading state for manual sync
    
    try {
      console.log('🔄 Media synchronization started', isAutoSync ? '(auto)' : '(manual)');
      
      const response = await fetch('/api/media/sync', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Sync completed:', result);
        
        // Reload media files after sync
        await loadUploadedFiles();
        
        // Show success message only for manual sync or if files were removed
        if (!isAutoSync || result.results.removed > 0) {
          const message = `Synchronization completed: ${result.results.synchronized} files valid, ${result.results.removed} stale references removed`;
          if (!isAutoSync) {
            alert(message);
          } else {
            console.log('🧹 Auto-sync:', message);
          }
        }
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('❌ Sync failed:', error);
      if (!isAutoSync) {
        alert('Synchronization failed. Please try again.');
      }
    } finally {
      if (!isAutoSync) setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">
            Kelola semua file media untuk konten MarkasAI ({uploadedFiles.length} files)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </label>
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}>
        <CardContent
          className="p-8 text-center cursor-pointer"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isUploading ? 'Uploading files...' : 'Upload Media Files'}
              </h3>
              <p className="text-gray-600 text-sm">
                Drag & drop gambar atau video di sini atau klik untuk browse
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Supports: JPG, PNG, GIF, WebP, MP4, MOV (Max 50MB)
              </p>
            </div>
            {isUploading && (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ File berhasil diupload dan tersimpan di folder media! Total: {uploadedFiles.length} files
          </AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            📤 Uploading files... Please wait
          </AlertDescription>
        </Alert>
      )}



      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari file..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadUploadedFiles}
                disabled={isUploading || isRefreshing}
              >
                {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => syncMediaFiles(false)} // Pass false for manual sync
                disabled={isUploading || isSyncing}
                className="text-blue-600 hover:text-blue-700"
              >
                {isSyncing ? '🔄 Syncing...' : '🔄 Sync with Blob'}
              </Button>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedFiles.length} file dipilih
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={deleteSelectedFiles}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus ({selectedFiles.length})
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <CardContent className="p-3">
                <div className="space-y-2">
                  {/* File Preview */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <File className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </p>
                      {file.isStatic && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          Static
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{file.size}</p>
                    {file.dimensions && (
                      <p className="text-xs text-gray-500">{file.dimensions}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      className="flex-1 h-8 text-xs"
                      data-url={file.url}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {file.deletable !== false && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFiles([file.id]);
                        }}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer ${selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                    }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <File className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      {file.isStatic && (
                        <Badge variant="secondary" className="text-xs">
                          Static File
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {file.size} • {file.dimensions} • {file.uploadedAt}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      data-url={file.url}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {file.deletable !== false && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFiles([file.id]);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada file ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan mengupload file pertama'}
            </p>
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </label>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}