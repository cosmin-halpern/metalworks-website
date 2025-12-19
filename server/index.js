/**
 * cPanel Bridge
 * This file stays in the root of the server folder and launches the compiled code.
 */
import('./dist/index.js').catch(err => {
    console.error('Failed to load server from dist:', err);
});