import { useState, useCallback } from 'react';
import { Message, Source } from '../types/chat';
import { agentQuery, AgentQueryResponse, AgentSource } from '../api/constitutional';

/**
 * Map backend doc_type to frontend Source type
 */
function mapDocType(docType: string | null): Source['type'] {
    if (!docType) return 'LAG';
    const normalized = docType.toLowerCase();
    if (normalized === 'sfs' || normalized === 'lag') return 'LAG';
    if (normalized === 'prop' || normalized === 'proposition') return 'PROP';
    if (normalized === 'sou') return 'SOU';
    return 'LAG'; // default
}

/**
 * Map backend AgentSource to frontend Source
 */
function mapSource(source: AgentSource): Source {
    return {
        id: source.id,
        title: source.title,
        type: mapDocType(source.doc_type),
        relevance: source.score,
    };
}

/**
 * Map evidence level to confidence score
 */
function evidenceToConfidence(level: string): number {
    switch (level) {
        case 'HIGH': return 0.90;
        case 'LOW': return 0.60;
        case 'NONE': return 0.30;
        default: return 0.50;
    }
}

export const useChatEngine = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'SYSTEM INITIALIZED. CONSTITUTIONAL MINISTRAL READY. AWAITING QUERY.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = useCallback(async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);
        setError(null);

        try {
            const response: AgentQueryResponse = await agentQuery({
                question: currentInput,
                mode: 'auto', // Let backend decide CHAT/ASSIST/EVIDENCE
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.answer,
                ragStats: {
                    latency: `${response.total_time_ms.toLocaleString()}ms`,
                    confidence: evidenceToConfidence(response.evidence_level),
                    pipeline: {
                        search: `${Math.round(response.total_time_ms * 0.1)}ms`, // ~10% for search
                        gen: `${Math.round(response.total_time_ms * 0.8)}ms`,    // ~80% for generation
                        verify: `${Math.round(response.total_time_ms * 0.1)}ms`, // ~10% for warden
                    },
                    sources: response.sources.map(mapSource),
                },
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('Agent query failed:', err);
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMsg);

            // Add error message to chat
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `⚠️ Connection error: ${errorMsg}\n\nBackend may be offline. Check that simons-ai-backend is running on port 8000.`,
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    }, [input]);

    const clearError = useCallback(() => setError(null), []);

    return {
        messages,
        input,
        setInput,
        handleSend,
        isTyping,
        error,
        clearError,
    };
};
