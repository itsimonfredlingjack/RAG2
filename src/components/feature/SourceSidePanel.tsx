import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, ExternalLink, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Source } from '../../types/chat';
import { getDocumentById, DocumentDetails } from '../../api/constitutional';

interface SourceSidePanelProps {
    source: Source;
    onClose: () => void;
}

const SourceSidePanel: React.FC<SourceSidePanelProps> = ({ source, onClose }) => {
    const [document, setDocument] = useState<DocumentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            setError(null);
            try {
                const doc = await getDocumentById(source.id);
                setDocument(doc);
                if (!doc) {
                    setError('Document not found in database');
                }
            } catch (err) {
                setError('Failed to load document');
                console.error('Document fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [source.id]);

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '400px',
                height: '100%',
                background: 'rgba(5, 15, 20, 0.95)',
                backdropFilter: 'blur(40px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                            background: 'rgba(0, 229, 255, 0.15)',
                            color: 'var(--neon-teal)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '1px'
                        }}>
                            {source.type}
                        </span>
                        <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ID: {source.id}</span>
                    </div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 500 }}>{source.title}</h3>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </motion.button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '20px'
                }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px 0', color: 'var(--text-muted)' }}>
                            <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            <span style={{ fontSize: '0.9rem' }}>Loading document...</span>
                        </div>
                    ) : error ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px 0', color: '#ff6b6b' }}>
                            <AlertCircle size={32} />
                            <span style={{ fontSize: '0.9rem' }}>{error}</span>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--neon-orange)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
                                <Shield size={16} />
                                VERIFIED_CONTENT
                            </div>

                            {/* Document metadata */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                {document?.doc_type && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--neon-teal)' }}>TYPE:</span> {document.doc_type.toUpperCase()}
                                    </div>
                                )}
                                {document?.source && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--neon-teal)' }}>SOURCE:</span> {document.source}
                                    </div>
                                )}
                                {document?.date && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span style={{ color: 'var(--neon-teal)' }}>DATE:</span> {document.date}
                                    </div>
                                )}
                            </div>

                            {/* Document content */}
                            <div style={{
                                lineHeight: '1.8',
                                color: '#ddd',
                                fontSize: '0.95rem',
                                whiteSpace: 'pre-wrap',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}>
                                {document?.content || 'No content available'}
                            </div>

                            {/* Relevance score */}
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RELEVANCE:</span>
                                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${source.relevance * 100}%`,
                                        height: '100%',
                                        background: source.relevance > 0.7 ? 'var(--neon-teal)' : source.relevance > 0.5 ? 'var(--neon-orange)' : '#ff6b6b',
                                        borderRadius: '2px'
                                    }} />
                                </div>
                                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--neon-teal)' }}>
                                    {(source.relevance * 100).toFixed(0)}%
                                </span>
                            </div>

                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}>
                                    <FileText size={14} />
                                    View in Riksdagen
                                    <ExternalLink size={12} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SourceSidePanel;
