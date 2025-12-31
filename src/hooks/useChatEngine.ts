import { useState } from 'react';
import { Message } from '../types/chat';

export const useChatEngine = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'SYSTEM INITIALIZED. CONSTITUTIONAL MISTRAL READY. AWAITING QUERY.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        // Simulate AI "Thinking" and then responding
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Analysis of "${currentInput}" completed against Constitutional Archives.\n\nKey finding: Chapter 2 of the Instrument of Government (Regeringsformen) establishes fundamental rights and freedoms, including the principle of public access to information, which is central to your inquiry.`,
                ragStats: {
                    latency: '1,247ms',
                    confidence: 0.85,
                    pipeline: { search: '45ms', gen: '1.1s', verify: '82ms' },
                    sources: [
                        { id: '1', title: 'Regeringsformen kap 2', type: 'LAG', relevance: 0.94 },
                        { id: '2', title: 'Tryckfrihetsförordningen', type: 'LAG', relevance: 0.89 },
                        { id: '3', title: 'SOU 2023:14', type: 'SOU', relevance: 0.72 }
                    ]
                }
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return {
        messages,
        input,
        setInput,
        handleSend,
        isTyping
    };
};
