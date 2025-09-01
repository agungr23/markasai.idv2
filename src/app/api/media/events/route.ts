// Server-Sent Events for real-time media updates
import { NextRequest } from 'next/server';
import { addConnection, removeConnection } from '@/lib/media-events';

export async function GET(request: NextRequest) {
    // Create readable stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            // Add connection to active connections
            addConnection(controller);

            // Send initial connection message
            const message = `data: ${JSON.stringify({ type: 'connected', message: 'Real-time media updates active' })}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));

            // Send keepalive every 30 seconds
            const keepAlive = setInterval(() => {
                try {
                    const ping = `data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(ping));
                } catch {
                    clearInterval(keepAlive);
                    removeConnection(controller);
                }
            }, 30000);

            // Cleanup on close
            request.signal.addEventListener('abort', () => {
                clearInterval(keepAlive);
                removeConnection(controller);
                try {
                    controller.close();
                } catch {
                    // Connection already closed
                }
            });
        },

        cancel(controller) {
            removeConnection(controller);
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control',
        },
    });
}