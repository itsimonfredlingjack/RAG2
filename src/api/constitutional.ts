/**
 * Constitutional AI - API Client for RAG2 Web UI
 * Connects to simons-ai-backend at port 8000
 */

import { getBaseUrl, ENDPOINTS } from '../config/env';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES (aligned with backend Pydantic models)
// ═══════════════════════════════════════════════════════════════════════════

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  content?: string;
  score: number;
  source: string;
  doc_type: string | null;
  date: string | null;
}

export interface SearchFilters {
  doc_type?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'date';
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  query: string;
}

export interface BatchSearchRequest {
  query: string;
  doc_types: string[];
  limit_per_type?: number;
}

export interface BatchSearchResponse {
  results_by_type: Record<string, SearchResult[]>;
  total: number;
  query: string;
  embedding_generated_once: boolean;
}

export interface OverviewStats {
  total_documents: number;
  collections: Record<string, number>;
  storage_size_mb: number;
  last_updated: string;
}

export interface GPUStats {
  name: string;
  memory_used: number;
  memory_total: number;
  utilization: number;
  temperature: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  ollama: {
    connected: boolean;
    version: string | null;
    models_available: string[];
    models_loaded: string[];
  };
  gpu_available: boolean;
  checks: Record<string, boolean>;
}

export interface CollectionInfo {
  name: string;
  document_count: number;
  metadata_fields: string[];
}

// Jail Warden v2 types
export type WardenStatus =
  | 'UNCHANGED'
  | 'TERM_CORRECTED'
  | 'QUESTION_REWRITTEN'
  | 'FACT_VERIFIED'
  | 'FACT_UNVERIFIED'
  | 'CITATIONS_STRIPPED'
  | 'ERROR';

export type EvidenceLevel = 'HIGH' | 'LOW' | 'NONE';

export type ResponseMode = 'CHAT' | 'ASSIST' | 'EVIDENCE';

export interface AgentSource {
  id: string;
  title: string;
  snippet: string;
  score: number;
  doc_type: string | null;
  source: string;
}

export interface AgentQueryRequest {
  question: string;
  mode?: 'auto' | 'chat' | 'assist' | 'evidence';
}

export interface AgentQueryResponse {
  answer: string;
  sources: AgentSource[];
  reasoning_steps: string[];
  model_used: string;
  total_time_ms: number;
  mode: ResponseMode;
  warden_status: WardenStatus;
  evidence_level: EvidenceLevel;
  corrections_applied: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }
    throw new ApiError(response.status, `Request failed: ${response.statusText}`, details);
  }

  return response.json();
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search documents in ChromaDB
 */
export async function searchDocuments(request: SearchRequest): Promise<SearchResponse> {
  const baseUrl = getBaseUrl();
  return fetchJson<SearchResponse>(`${baseUrl}${ENDPOINTS.SEARCH}`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Batch search across multiple doc_types with single embedding
 */
export async function searchDocumentsBatch(request: BatchSearchRequest): Promise<BatchSearchResponse> {
  const baseUrl = getBaseUrl();
  return fetchJson<BatchSearchResponse>(`${baseUrl}${ENDPOINTS.SEARCH_BATCH}`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENT API (Full RAG Pipeline)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send query to agentic RAG pipeline.
 * Includes: ChromaDB search → Ollama LLM → Jail Warden v2 → Evidence gating
 */
export async function agentQuery(request: AgentQueryRequest): Promise<AgentQueryResponse> {
  const baseUrl = getBaseUrl();
  return fetchJson<AgentQueryResponse>(`${baseUrl}${ENDPOINTS.AGENT_QUERY}`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS & HEALTH API
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get system overview stats (document counts, collections)
 */
export async function getOverviewStats(): Promise<OverviewStats | null> {
  try {
    const baseUrl = getBaseUrl();
    return await fetchJson<OverviewStats>(`${baseUrl}${ENDPOINTS.STATS}`);
  } catch (error) {
    console.error('Failed to fetch overview stats:', error);
    return null;
  }
}

/**
 * Get GPU stats (VRAM, utilization, temperature)
 */
export async function getGPUStats(): Promise<GPUStats | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetchJson<{ gpu: GPUStats | null }>(`${baseUrl}${ENDPOINTS.GPU}`);
    if (response.gpu) {
      return {
        name: response.gpu.name,
        memory_used: response.gpu.memory_used,
        memory_total: response.gpu.memory_total,
        utilization: response.gpu.utilization,
        temperature: response.gpu.temperature,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch GPU stats:', error);
    return null;
  }
}

/**
 * Get health check (Ollama connection, models loaded)
 */
export async function getHealth(): Promise<HealthCheck | null> {
  try {
    const baseUrl = getBaseUrl();
    return await fetchJson<HealthCheck>(`${baseUrl}${ENDPOINTS.HEALTH}`);
  } catch (error) {
    console.error('Failed to fetch health:', error);
    return null;
  }
}

/**
 * Get list of ChromaDB collections
 */
export async function getCollections(): Promise<CollectionInfo[]> {
  try {
    const baseUrl = getBaseUrl();
    return await fetchJson<CollectionInfo[]>(`${baseUrl}${ENDPOINTS.COLLECTIONS}`);
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// OLLAMA DIRECT API (for CHAT mode fallback)
// ═══════════════════════════════════════════════════════════════════════════

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

export interface OllamaChatResponse {
  model: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
}

/**
 * Direct chat with Ollama (used for CHAT mode without RAG)
 */
export async function ollamaChat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
  const ollamaUrl = getBaseUrl(11434);
  return fetchJson<OllamaChatResponse>(`${ollamaUrl}${ENDPOINTS.OLLAMA_CHAT}`, {
    method: 'POST',
    body: JSON.stringify({ ...request, stream: false }),
  });
}

/**
 * Get list of available Ollama models
 */
export async function getOllamaModels(): Promise<string[]> {
  try {
    const ollamaUrl = getBaseUrl(11434);
    const response = await fetchJson<{ models: Array<{ name: string }> }>(`${ollamaUrl}${ENDPOINTS.OLLAMA_TAGS}`);
    return response.models.map((m) => m.name);
  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT DETAILS API
// ═══════════════════════════════════════════════════════════════════════════

export interface DocumentDetails {
  id: string;
  title: string;
  content: string;
  doc_type: string | null;
  source: string;
  date: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Fetch full document content by ID.
 * Uses search endpoint with exact ID match as fallback.
 */
export async function getDocumentById(documentId: string): Promise<DocumentDetails | null> {
  try {
    // Search for the specific document by ID
    const response = await searchDocuments({
      query: documentId,
      limit: 10,
    });

    // Find exact match
    const doc = response.results.find(r => r.id === documentId);
    if (doc) {
      return {
        id: doc.id,
        title: doc.title,
        content: doc.snippet, // Full content from snippet
        doc_type: doc.doc_type,
        source: doc.source,
        date: doc.date,
        metadata: {},
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch document:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if backend is reachable
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const health = await getHealth();
    return health?.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Check if Ollama is available
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const models = await getOllamaModels();
    return models.length > 0;
  } catch {
    return false;
  }
}
