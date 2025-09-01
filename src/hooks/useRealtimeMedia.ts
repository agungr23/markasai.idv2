import { useState, useEffect, useCallback } from 'react';
import { MediaFile } from '@/types';

// Toast notification function (simple implementation)
let addToast: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export function setToastFunction(toastFn: (message: string, type: 'success' | 'error' | 'info') => void) {
    addToast = toastFn;
}

// Type guard functions
function isUploadEventData(data: unknown): data is { file: MediaFile } {
    return typeof data === 'object' && 
           data !== null && 
           'file' in data && 
           typeof (data as Record<string, unknown>).file === 'object' &&
           (data as Record<string, unknown>).file !== null;
}

function isDeleteEventData(data: unknown): data is { deletedFiles: string[] } {
    return typeof data === 'object' && 
           data !== null && 
           'deletedFiles' in data && 
           Array.isArray((data as Record<string, unknown>).deletedFiles);
}

function isUpdateEventData(data: unknown): data is { file: MediaFile } {
    return typeof data === 'object' && 
           data !== null && 
           'file' in data && 
           typeof (data as Record<string, unknown>).file === 'object' &&
           (data as Record<string, unknown>).file !== null;
}

interface MediaEvent {
    type: 'upload' | 'delete' | 'update' | 'connected' | 'ping' | 'sync';
    data?: unknown;
    message?: string;
    timestamp?: number;
}

export function useRealtimeMedia() {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

    // Load initial data
    const loadMediaFiles = useCallback(async () => {
        try {
            const response = await fetch('/api/media');
            if (response.ok) {
                const data = await response.json();
                setMediaFiles(data.files || []);
                setLastUpdate(new Date());
            }
        } catch {
            console.error('Failed to load media files');
        }
    }, []);

    // Handle real-time events
    const handleMediaEvent = useCallback((event: MediaEvent) => {
        console.log('🔄 Real-time media event:', event);

        switch (event.type) {
            case 'connected':
                setIsConnected(true);
                setConnectionStatus('connected');
                console.log('✅ Real-time connection established');
                break;

            case 'upload':
                if (isUploadEventData(event.data)) {
                    const uploadData = event.data;
                    setMediaFiles(prevFiles => {
                        // Check if file already exists (prevent duplicates)
                        const exists = prevFiles.some(f => f.id === uploadData.file.id);
                        if (exists) return prevFiles;

                        // Add new file to the beginning of the list
                        return [uploadData.file, ...prevFiles];
                    });
                    setLastUpdate(new Date());
                    console.log('📁 File uploaded:', uploadData.file.name);

                    // Show toast notification
                    if (addToast) {
                        addToast(`✅ ${uploadData.file.name} uploaded successfully`, 'success');
                    }
                }
                break;

            case 'delete':
                if (isDeleteEventData(event.data)) {
                    const deleteData = event.data;
                    setMediaFiles(prevFiles =>
                        prevFiles.filter(file => !deleteData.deletedFiles.includes(file.id))
                    );
                    setLastUpdate(new Date());
                    console.log('🗑️ Files deleted:', deleteData.deletedFiles);

                    // Show toast notification
                    if (addToast) {
                        const count = deleteData.deletedFiles.length;
                        addToast(`🗑️ ${count} file(s) deleted successfully`, 'success');
                    }
                }
                break;

            case 'update':
                if (isUpdateEventData(event.data)) {
                    const updateData = event.data;
                    setMediaFiles(prevFiles =>
                        prevFiles.map(file =>
                            file.id === updateData.file.id ? updateData.file : file
                        )
                    );
                    setLastUpdate(new Date());
                    console.log('✏️ File updated:', updateData.file.name);
                }
                break;

            case 'ping':
                // Keep connection alive
                break;

            case 'sync':
                // Media synchronization event - reload all files
                console.log('🔄 Media sync event received');
                await refreshMediaFiles();
                
                if (addToast) {
                    addToast('🔄 Media synchronized with blob storage', 'info');
                }
                break;

            default:
                console.log('Unknown event type:', event.type);
        }
    }, []);

    // Setup SSE connection
    useEffect(() => {
        let eventSource: EventSource | null = null;

        const connectSSE = () => {
            setConnectionStatus('connecting');
            eventSource = new EventSource('/api/media/events');

            eventSource.onopen = () => {
                console.log('📡 SSE connection opened');
                setConnectionStatus('connected');
                setIsConnected(true);
            };

            eventSource.onmessage = (event) => {
                try {
                    const mediaEvent: MediaEvent = JSON.parse(event.data);
                    handleMediaEvent(mediaEvent);
                } catch {
                    console.error('Failed to parse SSE event');
                }
            };

            eventSource.onerror = () => {
                console.error('SSE connection error');
                setIsConnected(false);
                setConnectionStatus('disconnected');

                // Reconnect after 5 seconds
                setTimeout(connectSSE, 5000);
            };
        };

        // Load initial data
        loadMediaFiles();

        // Start SSE connection
        connectSSE();

        // Cleanup
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [handleMediaEvent, loadMediaFiles]);

    // Manual refresh function
    const refreshMediaFiles = useCallback(async () => {
        await loadMediaFiles();
    }, [loadMediaFiles]);

    return {
        mediaFiles,
        isConnected,
        connectionStatus,
        lastUpdate,
        refreshMediaFiles,
        // Stats for debugging
        stats: {
            totalFiles: mediaFiles.length,
            lastUpdate: lastUpdate?.toLocaleTimeString(),
            connectionStatus
        }
    };
}