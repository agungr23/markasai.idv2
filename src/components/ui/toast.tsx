import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: Toast['type'], duration?: number) => void;
    removeToast: (id: string) => void;
}

const toastContext = {
    toasts: [] as Toast[],
    listeners: new Set<() => void>(),
    addToast: (message: string, type: Toast['type'], duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, message, type, duration };

        toastContext.toasts.push(toast);
        toastContext.listeners.forEach(listener => listener());

        if (duration > 0) {
            setTimeout(() => {
                toastContext.removeToast(id);
            }, duration);
        }
    },
    removeToast: (id: string) => {
        const index = toastContext.toasts.findIndex(t => t.id === id);
        if (index > -1) {
            toastContext.toasts.splice(index, 1);
            toastContext.listeners.forEach(listener => listener());
        }
    }
};

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const updateToasts = () => setToasts([...toastContext.toasts]);
        toastContext.listeners.add(updateToasts);
        updateToasts();

        return () => {
            toastContext.listeners.delete(updateToasts);
        };
    }, []);

    return {
        toasts,
        addToast: toastContext.addToast,
        removeToast: toastContext.removeToast
    };
}

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            max-w-md p-4 rounded-lg shadow-lg border flex items-center justify-between
            animate-in slide-in-from-right duration-300
            ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                'bg-blue-50 border-blue-200 text-blue-800'}
          `}
                >
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-3 p-1 hover:bg-black/10 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}