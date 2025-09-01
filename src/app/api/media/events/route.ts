// Server-Sent Events for real-time media updates
import { NextRequest } from 'next/server';

// Store active connections
const connections = new Set<ReadableStreamDefaultController>();

// Helper to broadcast events to all connected clients
export function broadcastMediaEvent(event: {
    type: 'upload' | 'delete' | 'update';
    data: any;
}) {
    const message = `data: ${JSON.stringify(event)}\n\n`;

    connections.forEach(controller => {
        try {
            controller.enqueue(new TextEncoder().encode(message));
        } catch (error) {
            // Remove dead connections
            connections.delete(controller);
        }
    });
}

export async function GET(request: NextRequest) {
    // Create readable stream for SSE
    const stream = new ReadableStream({
        start(controller) {
            // Add connection to active connections
            connections.add(controller);

            // Send initial connection message
            const message = `data: ${JSON.stringify({ type: 'connected', message: 'Real-time media updates active' })}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));

            // Send keepalive every 30 seconds
            const keepAlive = setInterval(() => {
                try {
                    const ping = `data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(ping));
                } catch (error) {
                    clearInterval(keepAlive);
                    connections.delete(controller);
                }
            }, 30000);

            // Cleanup on close
            request.signal.addEventListener('abort', () => {
                clearInterval(keepAlive);
                connections.delete(controller);
                try {
                    controller.close();
                } catch (error) {
                    // Connection already closed
                }
            });
        },

        cancel(controller) {
            connections.delete(controller);
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