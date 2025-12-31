import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, ExternalLink, Shield } from 'lucide-react';
import { Source } from '../../types/chat';

interface SourceSidePanelProps {
    source: Source;
    onClose: () => void;
}

const SourceSidePanel: React.FC<SourceSidePanelProps> = ({ source, onClose }) => {
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: 'var(--neon-orange)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
                        <Shield size={16} />
                        VERIFIED_CONTENT
                    </div>

                    <p style={{ lineHeight: '1.8', color: '#ddd', fontSize: '0.95rem', marginBottom: '20px' }}>
                        This is a placeholder for the actual text content of <strong>{source.title}</strong>.
                        In a real implementation, this panel would fetch and display the specific paragraph or section
                        referenced by the RAG system.
                    </p>

                    <p style={{ lineHeight: '1.8', color: '#bbb', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        "Regeringsformen (RF) är en av Sveriges fyra grundlagar. Den fastslår att all offentlig makt i Sverige utgår från folket och att den svenska folkstyrelsen bygger på fri åsiktsbildning och på allmän och lika rösträtt."
                    </p>

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
                             Open Full Document
                             <ExternalLink size={12} />
                         </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SourceSidePanel;
