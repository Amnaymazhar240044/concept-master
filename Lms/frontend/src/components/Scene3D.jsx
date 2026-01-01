import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, useAnimations } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';

// Placeholder 3D model - animated torus knot
function PlaceholderModel() {
    return (
        <mesh rotation={[0.5, 0.5, 0]}>
            <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
            <meshStandardMaterial
                color="#3b82f6"
                metalness={0.7}
                roughness={0.2}
                emissive="#1e40af"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
}

// Robot Model component with animations
function RobotModel() {
    const group = useRef();
    const { scene, animations } = useGLTF('/robot.glb');
    const { actions, names } = useAnimations(animations, group);

    useEffect(() => {
        // Play all animations
        if (names.length > 0) {
            names.forEach((name) => {
                const action = actions[name];
                if (action) {
                    action.reset().fadeIn(0.5).play();
                }
            });
        }
    }, [actions, names]);

    return (
        <group ref={group} position={[0, -0.8, 0]}>
            <primitive object={scene} scale={2.0} />
        </group>
    );
}

function Model({ modelPath }) {
    if (!modelPath) {
        return <PlaceholderModel />;
    }

    try {
        const { scene } = useGLTF(modelPath);
        return <primitive object={scene} scale={1.5} />;
    } catch (error) {
        console.warn('Model loading failed, using placeholder:', error);
        return <PlaceholderModel />;
    }
}

// Loading fallback
function Loader() {
    return null;
}

export default function Scene3D({ modelPath = null, autoRotate = true, useRobot = true }) {
    return (
        <div className="w-full h-full">
            <Canvas
                shadows={false}
                dpr={[1, 2]}
                className="bg-transparent"
                frameloop="always"
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance'
                }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 12]}
                    fov={45}
                    near={0.01}
                    far={1000}
                />

                {/* Lighting setup */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
                <pointLight position={[5, 5, 5]} intensity={0.4} color="#60a5fa" />

                {/* 3D Model */}
                <Suspense fallback={<Loader />}>
                    {useRobot && !modelPath ? <RobotModel /> : <Model modelPath={modelPath} />}
                </Suspense>

                {/* Camera controls */}
                <OrbitControls
                    enableZoom={false}
                    autoRotate={false}
                    autoRotateSpeed={2}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
}

