import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ParticleHead = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 3500;

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const spherical = new THREE.Spherical();
        const vector = new THREE.Vector3();

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;

            spherical.set(1.5, phi, theta);
            vector.setFromSpherical(spherical);

            temp[i * 3] = vector.x;
            temp[i * 3 + 1] = vector.y;
            temp[i * 3 + 2] = vector.z;
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;

            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.03;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#fff5f0"
                size={0.012}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
    );
};

const HolographicAvatar: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.4)' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={1} />
                <ParticleHead />
            </Canvas>

            {/* Tactical UI Overlays */}
            <div style={{ position: 'absolute', top: '24px', left: '24px', pointerEvents: 'none' }}>
                <div style={{ color: 'var(--neon-teal)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.8 }}>NEURAL_CORE_v2</div>
                <div className="font-mono" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem', marginTop: '4px' }}>TYPE: PARTICLE_FIELD</div>
            </div>

            <div style={{ position: 'absolute', top: '24px', right: '24px', textAlign: 'right', pointerEvents: 'none' }}>
                <div style={{ color: 'var(--neon-orange)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.8 }}>SYNC: ACTIVE</div>
                <div className="font-mono" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem', marginTop: '4px' }}>BITRATE: 4.8 GB/S</div>
            </div>

            {/* Centered Scanner Line */}
            <motion.div
                animate={{ top: ['20%', '80%', '20%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    left: '10%',
                    width: '80%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--neon-teal), transparent)',
                    opacity: 0.3,
                    boxShadow: '0 0 10px var(--neon-teal)',
                    zIndex: 5
                }}
            />

            {/* Bottom Status */}
            <div style={{
                position: 'absolute',
                bottom: '32px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
            }}>
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '3px',
                        textShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }}
                >
                    CONSTITUTIONAL CORE
                </motion.div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                            style={{ width: '4px', height: '4px', background: 'var(--neon-teal)', borderRadius: '1px' }}
                        />
                    ))}
                </div>
            </div>

            {/* Viewfinder Corners */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        </div>
    );
};

export default HolographicAvatar;
