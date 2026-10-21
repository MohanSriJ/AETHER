import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TelemetrySensor } from '../../types/city';
import { useSimulationStore } from '../../store/simulationStore';

interface SensorMarkerMeshProps {
  sensors: TelemetrySensor[];
}

export const SensorMarkerMesh: React.FC<SensorMarkerMeshProps> = ({ sensors }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const selectAsset = useSimulationStore(state => state.selectAsset);

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      const t = clock.getElapsedTime();
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.y = t * 0.8 + i;
      });
    }
  });

  return (
    <group ref={ringsRef}>
      {sensors.map((sensor) => {
        let color = '#54e7f2';
        if (sensor.status === 'critical') color = '#ff647c';
        else if (sensor.status === 'alert') color = '#ffbf69';
        else if (sensor.status === 'offline') color = '#62728d';

        const pos: [number, number, number] = [sensor.position[0], sensor.position[1] + 1.2, sensor.position[2]];

        return (
          <group
            key={sensor.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              if (sensor.associatedBuildingId) {
                selectAsset(sensor.associatedBuildingId);
              }
            }}
          >
            {/* Core glowing sensor orb */}
            <mesh>
              <sphereGeometry args={[0.45, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>

            {/* Orbiting radar sensor ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.7, 0.85, 24]} />
              <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>

            {/* Downward telemetry laser guide pin */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
