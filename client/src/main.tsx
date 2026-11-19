import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Self-hosted fonts (bundled by Vite) instead of Google Fonts, which blocked rendering
import '@fontsource-variable/inter';
import '@fontsource-variable/oswald';
import './index.css';
import { CartProvider } from './lib/cart';
import { InitialDataProvider, readInitialData } from './lib/initialData';

const app = (
    <InitialDataProvider value={readInitialData()}>
        <CartProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CartProvider>
    </InitialDataProvider>
);

// Public pages arrive already rendered by the server (server/src/ssr.ts), so React takes
// over the existing HTML; admin pages and the Vite dev server send an empty #root
const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
    ReactDOM.hydrateRoot(root, app);
} else {
    ReactDOM.createRoot(root).render(app);
}
