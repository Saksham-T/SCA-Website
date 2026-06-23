import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { NodeKey } from '../InsideStudio';

interface StudioCanvasProps {
  hoveredNode: NodeKey | null;
  setHoveredNode: (node: NodeKey | null) => void;
  activeNode: NodeKey | null;
  onNodeClick: (node: NodeKey) => void;
  mousePos: { x: 0; y: 0 } | { x: number; y: number };
  isFutureUnlocked: boolean;
  founderMode: boolean;
}

// Particle System with physics attraction
function InteractiveParticles({ hoveredNodePos, reducedMotion }: { hoveredNodePos: THREE.Vector3 | null, reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = reducedMotion ? 100 : 500;
  
  // Generate random positions
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6; // Z
    }
    return pos;
  });

  // Keep track of velocities
  const [velocities] = useState(() => {
    const vels = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      vels[i * 3] = (Math.random() - 0.5) * 0.02;
      vels[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return vels;
  });

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return;
    const geo = pointsRef.current.geometry;
    const attrib = geo.attributes.position;
    const array = attrib.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Default slow floating motion
      array[idx] += velocities[idx];
      array[idx + 1] += velocities[idx + 1];
      array[idx + 2] += velocities[idx + 2];

      // Bounce limits
      if (Math.abs(array[idx]) > 8) velocities[idx] *= -1;
      if (Math.abs(array[idx + 1]) > 5) velocities[idx + 1] *= -1;
      if (Math.abs(array[idx + 2]) > 4) velocities[idx + 2] *= -1;

      // Attract to hovered node
      if (hoveredNodePos) {
        const dx = hoveredNodePos.x - array[idx];
        const dy = hoveredNodePos.y - array[idx + 1];
        const dz = hoveredNodePos.z - array[idx + 2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist < 4) {
          // Accelerate toward node
          array[idx] += dx * 0.025;
          array[idx + 1] += dy * 0.025;
          array[idx + 2] += dz * 0.025;
        }
      }
    }
    attrib.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={hoveredNodePos ? '#a855f7' : '#2e54ea'}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// 3D Node Orb component
function HolographicNode({
  id,
  position,
  color,
  label,
  num,
  hoveredNode,
  setHoveredNode,
  onNodeClick,
  founderMode,
  reducedMotion
}: {
  id: NodeKey;
  position: [number, number, number];
  color: string;
  label: string;
  num: string;
  hoveredNode: NodeKey | null;
  setHoveredNode: (node: NodeKey | null) => void;
  onNodeClick: (node: NodeKey) => void;
  founderMode: boolean;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredNode === id;
  
  // Save position as Vector3 for particle attraction
  const [worldPos] = useState(() => new THREE.Vector3(...position));

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Slow drift rotation
    const time = state.clock.getElapsedTime();
    if (!reducedMotion) {
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.12;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.5 + position[1]) * 0.08;
      
      // Update world position coordinates for particle attraction
      worldPos.copy(meshRef.current.position);

      if (ringRef.current) {
        ringRef.current.rotation.x = time * 0.2;
        ringRef.current.rotation.y = time * 0.4;
      }
    }
  });

  const displayColor = founderMode ? '#ffb703' : color;
  const size = isHovered ? 0.75 : 0.5;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHoveredNode(id);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHoveredNode(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNodeClick(id);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={isHovered ? 1.8 : 0.8}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.8}
          transparent
          opacity={0.85}
        />
        
        {/* Holographic Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[size * 1.5, 0.03, 16, 64]} />
          <meshBasicMaterial color={displayColor} transparent opacity={0.35} />
        </mesh>

        {/* HTML Label HUD Overlay */}
        <Html distanceFactor={10} position={[0, size * 1.6, 0]} center>
          <div 
            className={`flex flex-col items-center select-none transition-all duration-300 pointer-events-none ${
              isHovered ? 'scale-110' : 'scale-95'
            }`}
          >
            <div className="flex items-center gap-1 bg-studio-panel/90 border border-studio-border/30 rounded-md px-2 py-0.5 shadow-xl whitespace-nowrap">
              <span className="text-[9px] font-mono text-studio-violet font-extrabold">{num}</span>
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-white">{label}</span>
            </div>
            <div 
              className={`w-0.5 h-3 bg-gradient-to-b mt-0.5 ${
                founderMode ? 'from-studio-amber to-transparent' : 'from-studio-blue to-transparent'
              }`}
            />
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// Scene controls and Lights
function SceneController({ mousePos, founderMode, reducedMotion }: { mousePos: { x: number, y: number }, founderMode: boolean, reducedMotion: boolean }) {
  const { camera } = useThree();
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    
    // Parallax scene camera tilting
    const targetX = mousePos.x * 2.5;
    const targetY = mousePos.y * 1.8 + 2; // base offset
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Spotlight cursor tracking
    if (spotlightRef.current) {
      spotlightRef.current.position.x = mousePos.x * 6;
      spotlightRef.current.position.y = mousePos.y * 4 + 4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} />
      <spotLight
        ref={spotlightRef}
        position={[0, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={founderMode ? 5 : 4}
        color={founderMode ? '#ffb703' : '#2e54ea'}
        castShadow
      />
    </>
  );
}

// 3D Grid Floor helper
function GridFloor({ founderMode }: { founderMode: boolean }) {
  return (
    <gridHelper
      args={[30, 30, founderMode ? '#ffb703' : '#2e54ea', '#101428']}
      position={[0, -3.2, 0]}
      rotation={[0, 0, 0]}
      opacity={0.15}
      transparent
    />
  );
}

export default function StudioCanvas({
  hoveredNode,
  setHoveredNode,
  activeNode,
  onNodeClick,
  mousePos,
  isFutureUnlocked,
  founderMode
}: StudioCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute hovered node coordinate for particle attraction
  const hoveredNodePos = (() => {
    if (!hoveredNode) return null;
    if (hoveredNode === 'velocity') return new THREE.Vector3(-3.2, 0.8, 0);
    if (hoveredNode === 'ownership') return new THREE.Vector3(-1.0, -1.2, 0.5);
    if (hoveredNode === 'craft') return new THREE.Vector3(1.6, 1.0, -0.5);
    if (hoveredNode === 'room') return new THREE.Vector3(3.4, -0.6, 0.2);
    if (hoveredNode === 'future') return new THREE.Vector3(0, 0, 1.0);
    return null;
  })();

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className="w-full h-full relative">
      {/* ThreeJS Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'auto' }}
      >
        <SceneController mousePos={mousePos} founderMode={founderMode} reducedMotion={reducedMotion} />
        
        {/* Particle System */}
        <InteractiveParticles hoveredNodePos={hoveredNodePos} reducedMotion={reducedMotion} />

        {/* 3D Grid Helper Floor */}
        <GridFloor founderMode={founderMode} />

        {/* Node 1: Velocity */}
        <HolographicNode
          id="velocity"
          position={[-3.2, 0.8, 0]}
          color="#2e54ea"
          label="Velocity"
          num="01"
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          onNodeClick={onNodeClick}
          founderMode={founderMode}
          reducedMotion={reducedMotion}
        />

        {/* Node 2: Ownership */}
        <HolographicNode
          id="ownership"
          position={[-1.0, -1.2, 0.5]}
          color="#a855f7"
          label="Ownership"
          num="02"
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          onNodeClick={onNodeClick}
          founderMode={founderMode}
          reducedMotion={reducedMotion}
        />

        {/* Node 3: Craft */}
        <HolographicNode
          id="craft"
          position={[1.6, 1.0, -0.5]}
          color="#ec4899"
          label="Craft"
          num="03"
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          onNodeClick={onNodeClick}
          founderMode={founderMode}
          reducedMotion={reducedMotion}
        />

        {/* Node 4: The Room */}
        <HolographicNode
          id="room"
          position={[3.4, -0.6, 0.2]}
          color="#39ff14"
          label="The Room"
          num="04"
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
          onNodeClick={onNodeClick}
          founderMode={founderMode}
          reducedMotion={reducedMotion}
        />

        {/* Node 5: Future (Only visible if unlocked) */}
        {isFutureUnlocked && (
          <HolographicNode
            id="future"
            position={[0, 0, 1.0]}
            color="#fc7233"
            label="Future"
            num="05"
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            onNodeClick={onNodeClick}
            founderMode={founderMode}
            reducedMotion={reducedMotion}
          />
        )}
      </Canvas>

      {/* MOBILE SWIPER INTERACTION OVERLAY (Fallback for mobile gesture ease) */}
      {isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 pointer-events-auto bg-studio-panel/85 px-4 py-2 border border-studio-border rounded-full shadow-lg">
          <button 
            onClick={() => onNodeClick('velocity')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-studio-blue/15 text-studio-blue border border-studio-blue/20 font-bold"
          >
            01
          </button>
          <button 
            onClick={() => onNodeClick('ownership')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-studio-violet/15 text-studio-violet border border-studio-violet/20 font-bold"
          >
            02
          </button>
          <button 
            onClick={() => onNodeClick('craft')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-pink-500/15 text-pink-500 border border-pink-500/20 font-bold"
          >
            03
          </button>
          <button 
            onClick={() => onNodeClick('room')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-green-500/15 text-green-500 border border-green-500/20 font-bold"
          >
            04
          </button>
          {isFutureUnlocked && (
            <button 
              onClick={() => onNodeClick('future')}
              className="text-[10px] font-mono px-2.5 py-1 rounded bg-orange-500/15 text-orange-500 border border-orange-500/20 font-bold animate-pulse"
            >
              05
            </button>
          )}
        </div>
      )}
    </div>
  );
}
