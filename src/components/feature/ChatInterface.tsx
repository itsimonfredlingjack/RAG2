import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, Terminal, FileText, CheckCircle, Clock, ChevronDown, Lock, Activity } from 'lucide-react';

interface Source {
    title: string;
    type: 'LAG' | 'PROP' | 'SOU';
    relevance: number;
    id: string;
}

interface RagStats {
    latency: string;
    confidence: number;
    sources: Source[];
    pipeline: {
        search: string;
        gen: string;
        verify: string;
    };
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    ragStats?: RagStats;
}

const ChatInterface: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'SYSTEM INITIALIZED. CONSTITUTIONAL MISTRAL READY. AWAITING QUERY.' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI "Thinking" and then responding
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Analysis of "${input}" completed against Constitutional Archives.\n\nKey finding: Chapter 2 of the Instrument of Government (Regeringsformen) establishes fundamental rights and freedoms, including the principle of public access to information, which is central to your inquiry.`,
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
        }, 1200);
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            background: 'linear-gradient(180deg, rgba(5, 15, 20, 0.4) 0%, rgba(5, 15, 20, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
        }}>
            {/* HUD Header */}
            <div style={{
                paddingBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative'
            }}>
                <motion.div
                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{
                        background: 'rgba(255, 136, 77, 0.15)',
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 136, 77, 0.2)'
                    }}>
                    <Cpu size={20} color="var(--neon-orange)" />
                </motion.div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, letterSpacing: '2px', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        MAIN_INTERFACE <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--neon-teal)', borderRadius: '4px', border: '1px solid var(--neon-teal)33' }}>ENCRYPTED</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '4px' }}>
                        SECURE_NODE: MISTRAL_7B_CONSTITUTIONAL
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', opacity: 0.6 }}>
                    <Lock size={14} color="var(--text-muted)" />
                    <Activity size={14} color="var(--neon-teal)" />
                </div>
            </div>

            {/* Cinematic Message Stream */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '12px', scrollbarWidth: 'thin' }}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                position: 'relative'
                            }}
                        >
                            {/* Message Container */}
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(255, 136, 77, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                                borderLeft: msg.role === 'assistant' ? '3px solid var(--neon-teal)' : 'none',
                                borderRight: msg.role === 'user' ? '3px solid var(--neon-orange)' : 'none',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: msg.role === 'assistant' ? '0 10px 30px rgba(0,229,255,0.03)' : 'none'
                            }}>
                                {/* Label Bar */}
                                <div style={{
                                    padding: '10px 20px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px',
                                    background: 'rgba(255,255,255,0.02)',
                                    color: msg.role === 'user' ? 'var(--neon-orange)' : 'var(--neon-teal)'
                                }}>
                                    {msg.role === 'user' ? <Terminal size={12} /> : <Cpu size={12} />}
                                    {msg.role === 'user' ? 'COMMAND_INPUT' : 'SYSTEM_ANALYSIS'}
                                </div>

                                {/* Content Body */}
                                <div style={{ padding: '20px', lineHeight: '1.8', fontSize: '1rem', color: '#f0f0f0', fontWeight: 300 }}>
                                    {msg.content.split('\n').map((line, i) => (
                                        <p key={i} style={{ margin: line === '' ? '12px 0' : '0' }}>{line}</p>
                                    ))}
                                </div>

                                {msg.role === 'assistant' && msg.ragStats && (
                                    <EvidenceDeck stats={msg.ragStats} />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Tactical Input */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ position: 'relative', marginTop: '10px' }}
            >
                <div style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 136, 77, 0.15)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    gap: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ opacity: 0.6, paddingLeft: '8px' }}>
                        <FileText size={20} color="var(--neon-orange)" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Initiate constitutional query sequence..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            padding: '14px 0',
                            outline: 'none',
                            fontSize: '1rem',
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.5px'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 136, 77, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        style={{
                            background: 'var(--neon-orange)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            width: '48px',
                            height: '48px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                    >
                        <Send size={20} strokeWidth={2.5} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const EvidenceDeck: React.FC<{ stats: RagStats }> = ({ stats }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ margin: '0 20px 20px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' }}>
            <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                borderBottom: expanded ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="var(--neon-teal)" />
                        <span className="font-mono" style={{ color: 'var(--neon-teal)' }}>{stats.latency}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} color={stats.confidence > 0.8 ? 'var(--neon-teal)' : 'var(--neon-orange)'} />
                        <span className="font-mono">{(stats.confidence * 100).toFixed(0)}% TRUST</span>
                    </div>
                </div>
                <motion.div
                    whileHover={{ color: '#fff' }}
                    onClick={() => setExpanded(!expanded)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-teal)', fontWeight: 600 }}
                >
                    SOURCES [{stats.sources.length}]
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                        <ChevronDown size={16} />
                    </motion.div>
                </motion.div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {stats.sources.map(source => (
                                <motion.div
                                    key={source.id}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderLeft: '2px solid var(--neon-teal)',
                                        padding: '12px',
                                        borderRadius: '0 6px 6px 0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.85rem'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            background: 'rgba(0, 229, 255, 0.15)', color: 'var(--neon-teal)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 600
                                        }}>{source.type}</span>
                                        <span style={{ color: '#eee' }}>{source.title}</span>
                                    </div>
                                    <div className="font-mono" style={{ color: 'var(--neon-teal)', opacity: 0.8, fontSize: '0.75rem' }}>
                                        REL: {source.relevance.toFixed(2)}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatInterface;
