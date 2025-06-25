/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
    export type RegisterSWOptions = {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (swScriptUrl: string) => void;
        onRegisterError?: (error: any) => void;
    };

    export function registerSW(options?: RegisterSWOptions): {
        updateServiceWorker: (reloadPage?: boolean) => void;
    };
}