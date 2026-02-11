/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_UPLOADS_URL?: string;
    // add more env variables here as you add them to .env
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}