import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  agentQuery,
  searchDocuments,
  getGPUStats,
  getHealth,
  getDocumentById,
  ApiError,
} from './constitutional';
import { getBaseUrl } from '../config/env';

// Mock the getBaseUrl function
vi.mock('../config/env', () => ({
  getBaseUrl: vi.fn(() => 'http://localhost:8000'),
  ENDPOINTS: {
    AGENT_QUERY: '/agent/query',
    SEARCH: '/search',
    GPU: '/gpu',
    HEALTH: '/health',
  },
}));

describe('Constitutional API Client', () => {
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test suite for agentQuery
  describe('agentQuery', () => {
    it('should return data on successful request', async () => {
      const mockResponse = { answer: 'Test answer', sources: [], reasoning_steps: [], model_used: 'test-model', total_time_ms: 100, mode: 'ASSIST', warden_status: 'UNCHANGED', evidence_level: 'HIGH', corrections_applied: [] };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await agentQuery({ question: 'Test' });
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/agent/query', expect.any(Object));
    });

    it('should throw ApiError on non-ok response', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ detail: 'Not found' }),
      });

      await expect(agentQuery({ question: 'Test' })).rejects.toThrow(ApiError);
      await expect(agentQuery({ question: 'Test' })).rejects.toMatchObject({
        status: 404,
        message: 'Request failed: Not Found',
      });
    });
  });

  // Test suite for searchDocuments
  describe('searchDocuments', () => {
    it('should return search results on successful request', async () => {
      const mockResponse = { results: [], total: 0, page: 1, limit: 10, query: 'test' };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const response = await searchDocuments({ query: 'test' });
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/search', expect.any(Object));
    });
  });

  // Test suite for getGPUStats
  describe('getGPUStats', () => {
    it('should return GPU stats on successful request', async () => {
        const mockGpuResponse = { gpu: { name: 'NVIDIA', memory_used: 10, memory_total: 100, utilization: 50, temperature: 60 } };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockGpuResponse),
        });

        const stats = await getGPUStats();
        expect(stats).toEqual(mockGpuResponse.gpu);
    });

    it('should return null if gpu stats are not available', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ gpu: null }),
        });

        const stats = await getGPUStats();
        expect(stats).toBeNull();
    });

    it('should return null and log error on fetch failure', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (fetch as any).mockRejectedValue(new Error('Network error'));

        const stats = await getGPUStats();
        expect(stats).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  // Test suite for getHealth
  describe('getHealth', () => {
    it('should return health status on successful request', async () => {
        const mockHealth = { status: 'healthy' };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockHealth),
        });

        const health = await getHealth();
        expect(health).toEqual(mockHealth);
    });

    it('should return null and log error on fetch failure', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        (fetch as any).mockRejectedValue(new Error('Network error'));

        const health = await getHealth();
        expect(health).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  // Test suite for getDocumentById
  describe('getDocumentById', () => {
    it('should return document details if found', async () => {
      const mockId = 'doc1';
      const mockResponse = { results: [{ id: mockId, title: 'Doc 1', snippet: 'Content', doc_type: 'LAG', source: 'test', date: null, score: 1.0 }], total: 1 };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const doc = await getDocumentById(mockId);
      expect(doc).not.toBeNull();
      expect(doc?.id).toBe(mockId);
    });

    it('should return null if document not found', async () => {
        const mockResponse = { results: [], total: 0 };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        const doc = await getDocumentById('non-existent');
        expect(doc).toBeNull();
    });
  });

  // Test suite for ApiError
  describe('ApiError', () => {
    it('should construct with status and message', () => {
      const error = new ApiError(404, 'Not Found');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('ApiError');
    });
  });
});
