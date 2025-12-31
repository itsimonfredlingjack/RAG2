import { useState, useEffect, useCallback } from 'react';
import { getGPUStats, getOverviewStats, getHealth, GPUStats, OverviewStats, HealthCheck } from '../api/constitutional';

export interface SystemMetrics {
    gpu: GPUStats | null;
    stats: OverviewStats | null;
    health: HealthCheck | null;
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

const POLL_INTERVAL = 5000; // 5 seconds

/**
 * Hook for polling system metrics from Constitutional AI backend.
 * Fetches GPU stats, document counts, and health status.
 */
export function useSystemMetrics(): SystemMetrics & { refresh: () => Promise<void> } {
    const [metrics, setMetrics] = useState<SystemMetrics>({
        gpu: null,
        stats: null,
        health: null,
        loading: true,
        error: null,
        lastUpdated: null,
    });

    const fetchMetrics = useCallback(async () => {
        try {
            // Fetch all metrics in parallel
            const [gpu, stats, health] = await Promise.all([
                getGPUStats(),
                getOverviewStats(),
                getHealth(),
            ]);

            setMetrics({
                gpu,
                stats,
                health,
                loading: false,
                error: null,
                lastUpdated: new Date(),
            });
        } catch (err) {
            console.error('Failed to fetch system metrics:', err);
            setMetrics(prev => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch metrics',
            }));
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchMetrics();

        // Set up polling interval
        const intervalId = setInterval(fetchMetrics, POLL_INTERVAL);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, [fetchMetrics]);

    return {
        ...metrics,
        refresh: fetchMetrics,
    };
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

/**
 * Format document count with suffix (K, M)
 */
export function formatDocCount(count: number): string {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(2)}M`;
}
