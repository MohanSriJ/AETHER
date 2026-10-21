import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';

export const HazardOverlayMesh: React.FC = () => {
  const activeScenario = useSimulationStore(state => state.activeScenario);
  const metrics = useSimulationStore(state => state.metrics);
  const fireRef = useRef<THREE.Mesh>(null);
  const heatRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (fireRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.15;
      fireRef.current.scale.set(pulse, 1, pulse);
    }
    if (heatRef.current) {
      heatRef.current.rotation.y = t * 0.05;
    }
  });

  if (!activeScenario) return null;

  return (
    <group>
      {/* FLOOD OVERLAY: Rising Water Surge Layer */}
      {activeScenario.id === 'flood' && metrics.maxFloodDepthMeters > 0 && (
        <mesh
          position={[-15, Math.min(2.2, metrics.maxFloodDepthMeters * 0.8) + 0.1, -45]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[140, 80]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.4}
            roughness={0.05}
            metalness={0.8}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* FIRE OVERLAY: Thermal Flare & Hazard Perimeter at Industrial Zone */}
      {activeScenario.id === 'fire' && (
        <group position={[50, 0.2, 8]}>
          {/* Pulsing thermal zone radius */}
          <mesh ref={fireRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[8, 16, 32]} />
            <meshBasicMaterial
              color="#ff4444"
              side={THREE.DoubleSide}
              transparent
              opacity={0.45}
            />
          </mesh>
          {/* Flame plume beacon */}
          <pointLight color="#ff4d4d" intensity={4} distance={30} position={[0, 8, 0]} />
        </group>
      )}

      {/* HEATWAVE OVERLAY: Atmospheric Thermal Inversion Dome */}
      {activeScenario.id === 'heatwave' && (
        <mesh ref={heatRef} position={[0, 0, 0]}>
          <sphereGeometry args={[110, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial
            color="#ff8c00"
            wireframe
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
};
