import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { StatKey } from '../Stats3D';

interface StatsCanvasProps {
  hoveredStat: StatKey | null;
  setHoveredStat: (key: StatKey | null) => void;
  onStatClick: (key: StatKey) => void;
  mousePos: { x: number; y: number };
}

function Stat3DCard({
  id,
  position,
  color,
  num,
  name,
  value,
  unit = '',
  label,
  hoveredStat,
  setHoveredStat,
  onStatClick,
  reducedMotion
}: {
  id: StatKey;
  position: [number, number, number];
  color: string;
  num: string;
  name: string;
  value: string;
  unit?: string;
  label: string;
  hoveredStat: StatKey | null;
  setHoveredStat: (key: StatKey | null) => void;
  onStatClick: (key: StatKey) => void;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredStat === id;

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();
    // Gentle floating offset
    meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.05;
  });

  const scale = isHovered ? 1.08 : 1.0;

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredStat(id);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHoveredStat(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onStatClick(id);
      }}
    >
      {/* Box geometry representing the card */}
      <boxGeometry args={[2.0, 0.9, 0.15]} />
      <meshPhysicalMaterial
        color={isHovered ? color : '#0a0d1d'}
        emissive={isHovered ? color : '#101428'}
        emissiveIntensity={isHovered ? 1.2 : 0.2}
        roughness={0.2}
        metalness={0.8}
        transmission={0.4}
        thickness={0.5}
        transparent
        opacity={0.9}
      />

      {/* Wireframe border outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.0, 0.9, 0.15)]} />
        <lineBasicMaterial color={isHovered ? color : 'rgba(46, 84, 234, 0.3)'} linewidth={1} />
      </lineSegments>

      {/* HTML overlay for statistics numbers */}
      <Html distanceFactor={6} center position={[0, 0, 0.1]}>
        <div 
          className="flex flex-col items-start select-none pointer-events-none w-[110px]"
        >
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-studio-blue/40" />
            <span className="text-[7px] font-mono text-gray-500 tracking-wider font-extrabold uppercase">{name}</span>
          </div>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <strong className="text-xl font-display font-black text-white leading-none tracking-tight">
              {value}
            </strong>
            {unit && <small className="text-[10px] font-mono text-studio-blue font-bold">{unit}</small>}
          </div>
          <span className="text-[6px] font-mono text-gray-600 mt-0.5 uppercase tracking-widest">{label}</span>
        </div>
      </Html>
    </mesh>
  );
}

// Controls camera tilt on mouse move
function SceneController({ mousePos, reducedMotion }: { mousePos: { x: number; y: number }, reducedMotion: boolean }) {
  const { camera } = useThreeProps();
  
  useFrame(() => {
    if (reducedMotion) return;
    const targetX = mousePos.x * 1.5;
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 3, 3]} intensity={1.5} color="#2e54ea" />
    </>
  );
}

// Simple useThree proxy helper to avoid import error
function useThreeProps() {
  const state = (Canvas as any).state || {};
  return {
    camera: state.camera || new THREE.PerspectiveCamera()
  };
}

export default function StatsCanvas({ hoveredStat, setHoveredStat, onStatClick, mousePos }: StatsCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  // Custom camera resolution scaling for mobile viewport fit
  const cardSpacing = isMobile ? 1.7 : 2.3;
  const positions: Record<StatKey, [number, number, number]> = {
    roles: [-cardSpacing * 1.5, 0, 0],
    depts: [-cardSpacing * 0.5, 0, 0],
    team: [cardSpacing * 0.5, 0, 0],
    reply: [cardSpacing * 1.5, 0, 0]
  };

  return (
    <Canvas
      camera={{ position: [0, 0, isMobile ? 5.5 : 4.0], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'auto' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 4]} intensity={2} color="#2e54ea" />

      {/* Stat 1: Open Roles */}
      <Stat3DCard
        id="roles"
        position={positions.roles}
        color="#2e54ea"
        num="01"
        name="OPEN ROLES"
        value="13"
        label="LIVE CHANNELS"
        hoveredStat={hoveredStat}
        setHoveredStat={setHoveredStat}
        onStatClick={onStatClick}
        reducedMotion={reducedMotion}
      />

      {/* Stat 2: Departments */}
      <Stat3DCard
        id="depts"
        position={positions.depts}
        color="#a855f7"
        num="02"
        name="DEPARTMENTS"
        value="4"
        label="STUDIO SECTORS"
        hoveredStat={hoveredStat}
        setHoveredStat={setHoveredStat}
        onStatClick={onStatClick}
        reducedMotion={reducedMotion}
      />

      {/* Stat 3: Team count */}
      <Stat3DCard
        id="team"
        position={positions.team}
        color="#39ff14"
        num="03"
        name="ON THE TEAM"
        value="14"
        label="ACTIVE SEATS"
        hoveredStat={hoveredStat}
        setHoveredStat={setHoveredStat}
        onStatClick={onStatClick}
        reducedMotion={reducedMotion}
      />

      {/* Stat 4: Reply SLA */}
      <Stat3DCard
        id="reply"
        position={positions.reply}
        color="#fc7233"
        num="04"
        name="REPLY TIME"
        value="48"
        unit="HRS"
        label="FOUNDER SLA"
        hoveredStat={hoveredStat}
        setHoveredStat={setHoveredStat}
        onStatClick={onStatClick}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
