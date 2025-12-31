import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleNetwork = () => {
    const count = 100; // Number of particles
    const particlesRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    // Initial positions and velocities
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = [];
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10; // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
            vel.push({
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            });
        }
        return [pos, vel];
    }, []);

    useFrame((_state) => {
        if (!particlesRef.current || !linesRef.current) return;

        const positionsArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

        // Update particles
        for (let i = 0; i < count; i++) {
            let x = positionsArray[i * 3];
            let y = positionsArray[i * 3 + 1];
            let z = positionsArray[i * 3 + 2];

            x += velocities[i].x;
            y += velocities[i].y;
            z += velocities[i].z;

            // Bounce off boundaries
            if (x > 5 || x < -5) velocities[i].x *= -1;
            if (y > 5 || y < -5) velocities[i].y *= -1;
            if (z > 5 || z < -5) velocities[i].z *= -1;

            positionsArray[i * 3] = x;
            positionsArray[i * 3 + 1] = y;
            positionsArray[i * 3 + 2] = z;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Update lines
        const linePositions = [];
        const lineColors = [];

        // Connect particles that are close
        for (let i = 0; i < count; i++) {
            const x1 = positionsArray[i * 3];
            const y1 = positionsArray[i * 3 + 1];
            const z1 = positionsArray[i * 3 + 2];

            for (let j = i + 1; j < count; j++) {
                const x2 = positionsArray[j * 3];
                const y2 = positionsArray[j * 3 + 1];
                const z2 = positionsArray[j * 3 + 2];

                const dist = Math.sqrt(
                    Math.pow(x1 - x2, 2) +
                    Math.pow(y1 - y2, 2) +
                    Math.pow(z1 - z2, 2)
                );

                if (dist < 2.5) {
                    linePositions.push(x1, y1, z1, x2, y2, z2);
                    const alpha = 1 - (dist / 2.5);
                    // Use CSS variable colors if possible, but here we hardcode for THREE
                    // Cyan-ish color
                    lineColors.push(0, 0.95, 1, alpha, 0, 0.95, 1, alpha);
                }
            }
        }

        linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
        linesRef.current.geometry.attributes.position.needsUpdate = true;
        linesRef.current.geometry.attributes.color.needsUpdate = true;

        // Rotate entire system slowly
        particlesRef.current.rotation.y += 0.001;
        linesRef.current.rotation.y += 0.001;
    });

    return (
        <>
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#00f3ff"
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>
            <lineSegments ref={linesRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    vertexColors
                    transparent
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </>
    );
};

const NeuralBackground: React.FC = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)'
        }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                <ParticleNetwork />
                <fog attach="fog" args={['#000000', 5, 15]} />
            </Canvas>
        </div>
    );
};

export default NeuralBackground;
