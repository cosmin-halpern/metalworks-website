import { createContext, useContext } from 'react';

// Data the server already loaded while rendering the page (server/src/ssr.ts). It is sent
// along in a JSON script tag so the browser's first render matches the server's HTML
// instead of starting from a spinner. Shapes match the corresponding /api responses.
export type InitialData = {
    projects?: unknown[]; // GET /api/projects -> data
    clientLogos?: unknown[]; // GET /api/clients
};

export const INITIAL_DATA_ELEMENT_ID = 'initial-data';

const InitialDataContext = createContext<InitialData>({});

export const InitialDataProvider = InitialDataContext.Provider;

export function useInitialData<T>(key: keyof InitialData): T[] | undefined {
    return useContext(InitialDataContext)[key] as T[] | undefined;
}

export function readInitialData(): InitialData {
    try {
        const el = document.getElementById(INITIAL_DATA_ELEMENT_ID);
        return el?.textContent ? JSON.parse(el.textContent) : {};
    } catch {
        return {};
    }
}
