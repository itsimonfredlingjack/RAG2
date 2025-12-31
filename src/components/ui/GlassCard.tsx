import React, { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    variant = 'primary',
    glow = false,
    style,
    className,
    ...props
}) => {
    return (
        <div
            className={className}
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)', // Safari support
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: glow ? 'var(--neon-shadow)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                position: 'relative',
                ...style
            }}
            {...props}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--glass-highlight), transparent)',
                opacity: 0.5
            }} />
            {children}
        </div>
    );
};

export default GlassCard;
