import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { Database, Cpu, Layers, Shield, Zap, Info, AlertTriangle } from 'lucide-react';
import { useSystemMetrics, formatDocCount } from '../../hooks/useSystemMetrics';

const Sidebar: React.FC = () => {
    const { gpu, stats, health, loading, error } = useSystemMetrics();

    // Derive values from real data with fallbacks
    const gpuUtil = gpu?.utilization ?? 0;
    const temp = gpu?.temperature ?? 0;
    const vramUsed = gpu ? gpu.memory_used / 1024 : 0; // Convert MB to GB
    const vramTotal = gpu ? gpu.memory_total / 1024 : 12; // Convert MB to GB
    const totalDocs = stats?.total_documents ?? 0;
    const collectionCount = stats ? Object.keys(stats.collections).length : 0;
    const isConnected = health?.status === 'healthy';

    return (
        <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }} glow>
            {/* Branding Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)', position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.3 }}>
                    <Shield size={16} color="var(--neon-teal)" />
                </div>
                <h2 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: 'var(--neon-orange)',
                    textShadow: 'var(--neon-glow)',
                    fontFamily: 'Outfit, sans-serif'
                }}>CONSTITUTIONAL<br /><span style={{ color: '#fff', fontSize: '0.9rem' }}>MISTRAL ENGINE</span></h2>
                <div className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isConnected ? 'var(--neon-teal)' : '#ff4d4d',
                        boxShadow: isConnected ? 'var(--teal-glow)' : '0 0 10px #ff4d4d'
                    }} />
                    {loading ? 'CONNECTING...' : isConnected ? 'SYSTEM ONLINE' : 'OFFLINE'}
                </div>
            </motion.div>

            {/* Model Array */}
            <Section title="NEURAL CHIPS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ModelChip name="Mistral 3" spec="14B-QN" active />
                    <ModelChip name="GPT SW3" spec="6.7B-SV" active />
                </div>
            </Section>

            {/* Knowledge Vault */}
            <Section title="KNOWLEDGE VAULT">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <StatBox label="TOTAL_DOCS" value={formatDocCount(totalDocs)} icon={<Database size={12} />} color="var(--neon-teal)" />
                    <StatBox label="COLLECTIONS" value={collectionCount.toString().padStart(2, '0')} icon={<Layers size={12} />} color="var(--neon-orange)" />
                </div>
                <div className="font-mono" style={{ marginTop: '8px', fontSize: '0.6rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '4px' }}>
                    {stats ? Object.keys(stats.collections).slice(0, 2).map(c => c.toUpperCase().replace('_', ' ')).join(' | ') : '[LOADING...]'}
                </div>
            </Section>

            {/* System Telemetry */}
            <Section title="SYSTEM TELEMETRY">
                {error ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4d', fontSize: '0.75rem' }}>
                        <AlertTriangle size={14} />
                        Backend offline
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <MetricBar label="GPU UTILS" value={gpuUtil} max={100} unit="%" color="var(--neon-orange)" />
                        <MetricBar label={`VRAM (${vramTotal.toFixed(0)}GB)`} value={vramUsed} max={vramTotal} unit="GB" color="var(--neon-teal)" />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <MetricBar label="TEMP" value={temp} max={90} unit="°C" color={temp > 75 ? '#ff4d4d' : 'var(--neon-teal)'} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                                <div className="font-mono" style={{ fontSize: '0.6rem', color: gpu ? 'var(--neon-teal)' : 'var(--text-muted)' }}>
                                    {gpu ? `STATUS: ${gpu.name.includes('4070') ? 'RTX 4070' : 'GPU'}` : 'NO GPU'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Section>

            {/* System Status Indicators */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Zap size={10} color="var(--neon-orange)" /> API: <span style={{ color: '#fff' }}>200MS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Info size={10} color="var(--neon-teal)" /> DB: <span style={{ color: '#fff' }}>SECURE</span>
                    </div>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)' }} />
                <div className="font-mono" style={{ fontSize: '0.6rem', textAlign: 'center', color: 'var(--text-muted)', opacity: 0.5 }}>
                    MISTRAL_OS_v1.0.4_STABLE
                </div>
            </div>
        </GlassCard>
    );
};

// Sub-components

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
        <div style={{ fontSize: '0.65rem', color: 'var(--neon-orange)', letterSpacing: '2px', fontWeight: 600, opacity: 0.8 }}>{title}</div>
        {children}
    </motion.div>
);

const ModelChip: React.FC<{ name: string, spec: string, active?: boolean }> = ({ name, spec, active }) => (
    <motion.div
        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
        style={{
            background: active ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${active ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255,255,255,0.05)'}`,
            padding: '10px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'default'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                <Cpu size={14} color={active ? 'var(--neon-teal)' : 'var(--text-secondary)'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#fff' }}>{name}</span>
                <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{spec}</span>
            </div>
        </div>
        {active && (
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-teal)', boxShadow: 'var(--teal-glow)' }} />
        )}
    </motion.div>
);

const StatBox: React.FC<{ label: string, value: string, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
    <motion.div
        whileHover={{ translateY: -2 }}
        style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '1px' }}>
            {icon} {label}
        </div>
        <div className="font-mono" style={{ color: color, fontSize: '1.2rem', fontWeight: 500, textShadow: `0 0 10px ${color}44` }}>
            {value}
        </div>
    </motion.div>
);

const MetricBar: React.FC<{ label: string, value: number, max: number, unit: string, color: string }> = ({ label, value, max, unit, color }) => (
    <div style={{ fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>{label}</span>
            <span className="font-mono" style={{ color: color, fontSize: '0.65rem' }}>{value.toFixed(1)}{unit}</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <motion.div
                animate={{ width: `${(value / max) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    height: '100%',
                    background: color,
                    boxShadow: `0 0 8px ${color}`
                }}
            />
        </div>
    </div>
);

export default Sidebar;
