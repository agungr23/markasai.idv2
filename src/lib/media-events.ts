// Media events broadcasting utility
// Store active connections
const connections = new Set<ReadableStreamDefaultController>();

// Helper to broadcast events to all connected clients
export function broadcastMediaEvent(event: {
    type: 'upload' | 'delete' | 'update';
    data: unknown;
}) {
    const message = `data: ${JSON.stringify(event)}\n\n`;

    connections.forEach(controller => {
        try {
            controller.enqueue(new TextEncoder().encode(message));
        } catch {
            // Remove dead connections
            connections.delete(controller);
        }
    });
}

// Add connection to the set
export function addConnection(controller: ReadableStreamDefaultController) {
    connections.add(controller);
}

// Remove connection from the set
export function removeConnection(controller: ReadableStreamDefaultController) {
    connections.delete(controller);
}

// Get connection count for debugging
export function getConnectionCount() {
    return connections.size;
}