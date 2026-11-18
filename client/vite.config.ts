import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react()],
    // The SSR bundle only needs code; public/ is already served from dist/
    publicDir: isSsrBuild ? false : 'public',
    // The SSR bundle (entry-server.tsx) runs on a host where `npm install` isn't available,
    // so it must contain React and every other dependency
    ssr: {
        noExternal: true,
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
}));
