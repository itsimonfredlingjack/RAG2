import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 15, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Reset if text changes significantly (though normally we just append, for a new message we reset)
        // Actually, if 'text' prop changes, we might want to just show the full text if it was already completed,
        // or if it's a completely new string, restart.
        // For simplicity, let's assume this component is mounted once per message content.
        if (text === displayedText) return;

        // If the text is much shorter (unlikely) or we need to restart
        if (index === 0) {
            setDisplayedText('');
        }
    }, [text]);

    useEffect(() => {
        if (index < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
            }, speed);
            return () => clearTimeout(timeoutId);
        } else if (onComplete) {
            onComplete();
        }
    }, [index, text, speed, onComplete]);

    // If the component unmounts or text changes, we might want to ensure we don't leave it halfway if it was intended to be static.
    // But for the streaming effect, the state preservation is fine.

    return (
        <>
            {displayedText.split('\n').map((line, i) => (
                <p key={i} style={{
                    margin: line === '' ? '16px 0' : '0 0 8px 0',
                    lineHeight: 'inherit'
                }}>{line || '\u00A0'}</p>
            ))}
            {index < text.length && (
                <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '14px',
                    background: 'var(--neon-teal)',
                    marginLeft: '4px',
                    verticalAlign: 'middle',
                    animation: 'blink 1s step-end infinite'
                }} />
            )}
            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </>
    );
};

export default Typewriter;
