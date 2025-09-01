import { useState, useEffect, useCallback } from 'react';
import { MediaFile } from '@/types';

// Toast notification function (simple implementation)
let addToast: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

export function setToastFunction(toastFn: (message: string, type: 'success' | 'error' | 'info') => void) {
    addToast = toastFn;
}

interface MediaEvent {
    type: 'upload' | 'delete' | 'update' | 'connected' | 'ping';
    data?: any;
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
        } catch (error) {
            console.error('Failed to load media files:', error);
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
                if (event.data?.file) {
                    setMediaFiles(prevFiles => {
                        // Check if file already exists (prevent duplicates)
                        const exists = prevFiles.some(f => f.id === event.data.file.id);
                        if (exists) return prevFiles;

                        // Add new file to the beginning of the list
                        return [event.data.file, ...prevFiles];
                    });
                    setLastUpdate(new Date());
                    console.log('📁 File uploaded:', event.data.file.name);

                    // Show toast notification
                    if (addToast) {
                        addToast(`✅ ${event.data.file.name} uploaded successfully`, 'success');
                    }
                }
                break;

            case 'delete':
                if (event.data?.deletedFiles) {
                    setMediaFiles(prevFiles =>
                        prevFiles.filter(file => !event.data.deletedFiles.includes(file.id))
                    );
                    setLastUpdate(new Date());
                    console.log('🗑️ Files deleted:', event.data.deletedFiles);

                    // Show toast notification
                    if (addToast) {
                        const count = event.data.deletedFiles.length;
                        addToast(`🗑️ ${count} file(s) deleted successfully`, 'success');
                    }
                }
                break;

            case 'update':
                if (event.data?.file) {
                    setMediaFiles(prevFiles =>
                        prevFiles.map(file =>
                            file.id === event.data.file.id ? event.data.file : file
                        )
                    );
                    setLastUpdate(new Date());
                    console.log('✏️ File updated:', event.data.file.name);
                }
                break;

            case 'ping':
                // Keep connection alive
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
                } catch (error) {
                    console.error('Failed to parse SSE event:', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE error:', error);
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