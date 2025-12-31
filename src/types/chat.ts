export interface Source {
    title: string;
    type: 'LAG' | 'PROP' | 'SOU';
    relevance: number;
    id: string;
}

export interface RagStats {
    latency: string;
    confidence: number;
    sources: Source[];
    pipeline: {
        search: string;
        gen: string;
        verify: string;
    };
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    ragStats?: RagStats;
}
