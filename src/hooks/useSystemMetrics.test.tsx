import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSystemMetrics } from './useSystemMetrics';
import * as api from '../api/constitutional';
import { GPUStats, OverviewStats, HealthCheck } from '../api/constitutional';

// Mock the constitutional API
vi.mock('../api/constitutional');

const mockGetGPUStats = vi.spyOn(api, 'getGPUStats');
const mockGetOverviewStats = vi.spyOn(api, 'getOverviewStats');
const mockGetHealth = vi.spyOn(api, 'getHealth');

const mockGpu: GPUStats = { name: 'Test GPU', memory_used: 100, memory_total: 1000, utilization: 50, temperature: 60 };
const mockStats: OverviewStats = { total_documents: 123, collections: {}, storage_size_mb: 500, last_updated: new Date().toISOString() };
const mockHealth: HealthCheck = { status: 'healthy', version: '1.0', timestamp: new Date().toISOString(), ollama: { connected: true, version: '1.2', models_available: [], models_loaded: [] }, gpu_available: true, checks: {} };

describe('useSystemMetrics Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    mockGetGPUStats.mockResolvedValue(mockGpu);
    mockGetOverviewStats.mockResolvedValue(mockStats);
    mockGetHealth.mockResolvedValue(mockHealth);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start in a loading state and fetch initial metrics', async () => {
    const { result } = renderHook(() => useSystemMetrics());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.gpu).toEqual(mockGpu);
    // In StrictMode, useEffect runs twice, so we expect two initial fetches.
    expect(mockGetGPUStats).toHaveBeenCalledTimes(2);
  });

  it('should poll for new metrics every 5 seconds', async () => {
    renderHook(() => useSystemMetrics());

    await act(async () => {
        await vi.runOnlyPendingTimersAsync(); // Initial fetch
    });

    // Clear mocks after initial render to test polling in isolation
    vi.clearAllMocks();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000); // First poll
    });

    expect(mockGetGPUStats).toHaveBeenCalledTimes(1);

    await act(async () => {
        await vi.advanceTimersByTimeAsync(5000); // Second poll
      });

    expect(mockGetGPUStats).toHaveBeenCalledTimes(2);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API is down';
    mockGetGPUStats.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSystemMetrics());

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toContain(errorMessage);
    expect(result.current.gpu).toBeNull();
  });

  it('should clean up the interval on unmount', async () => {
    const { unmount } = renderHook(() => useSystemMetrics());

    await act(async () => {
        await vi.runOnlyPendingTimersAsync();
    });

    // Clear mocks after initial render to test cleanup in isolation
    vi.clearAllMocks();

    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(mockGetGPUStats).not.toHaveBeenCalled();
  });
});
