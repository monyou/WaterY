import { createSignal } from 'solid-js';

type Toast = {
    id: number;
    message: string;
    type?: 'success' | 'error' | 'info';
};

const [toasts, setToasts] = createSignal<Toast[]>([]);

let nextId = 1;

export const addToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = nextId++;
    setToasts((ts) => [...ts, { id, message, type }]);
    setTimeout(() => {
        setToasts((ts) => ts.filter((t) => t.id !== id));
    }, duration);
}

export const useToasts = () => {
    return toasts;
}
