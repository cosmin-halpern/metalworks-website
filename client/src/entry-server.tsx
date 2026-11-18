// Server-side entry: built by `vite build --ssr` into client/dist-server/entry-server.js
// (React and all other dependencies bundled in) and called by server/src/ssr.ts.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './lib/cart';
import { InitialData, InitialDataProvider } from './lib/initialData';

export function render(url: string, data: InitialData): string {
    return renderToString(
        <InitialDataProvider value={data}>
            <CartProvider>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </CartProvider>
        </InitialDataProvider>
    );
}
