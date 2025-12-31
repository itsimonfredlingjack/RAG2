/**
 * Environment Configuration for RAG2 Web UI
 * Connects to Constitutional AI FastAPI backend
 */

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ollamaUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
} as const;

/**
 * Get base URL that works from any device on the network.
 * In browser: uses current hostname (enables access from other devices)
 * In SSR/tests: uses environment variable
 */
export function getBaseUrl(port: number = 8000): string {
  if (typeof window !== 'undefined') {
    // Browser environment - use current hostname for network access
    return `http://${window.location.hostname}:${port}`;
  }
  // Fallback for non-browser
  return port === 11434 ? config.ollamaUrl : config.apiUrl;
}

/**
 * API endpoints for Constitutional AI
 */
export const ENDPOINTS = {
  // Constitutional RAG
  SEARCH: '/api/constitutional/search',
  SEARCH_BATCH: '/api/constitutional/search-batch',
  AGENT_QUERY: '/api/constitutional/agent/query',
  STATS: '/api/constitutional/stats/overview',
  COLLECTIONS: '/api/constitutional/collections',

  // System
  GPU: '/api/gpu/stats',
  HEALTH: '/api/health',

  // Ollama (different port)
  OLLAMA_CHAT: '/api/chat',
  OLLAMA_TAGS: '/api/tags',
} as const;
