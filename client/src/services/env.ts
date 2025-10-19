// src/services/env.ts
export function getApiBaseUrl(): string {
  try {
    if (
      typeof import.meta !== 'undefined' &&
      (import.meta as any)["env"] &&
      (import.meta as any)["env"].VITE_API_BASE_URL
    ) {
      return (import.meta as any)["env"].VITE_API_BASE_URL;
    }
  } catch (e) {
    // Ignore if not available
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL;
  }
  return 'http://localhost:3001';
}

