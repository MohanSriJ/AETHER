import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSettingsStore } from '../../store/settingsStore';

export const PerimeterForestMesh: React.FC = () => {
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  // Generate deterministic tree coordinates surrounding the tech park campus
  const treePositions = useMemo(() => {
    const list: Array<{ x: number; z: number; scale: number; type: 'pine' | 'canopy' }> = [];

    // 1. North perimeter forest ridge (z: -42 to -68)
    for (let x = -75; x <= 75; x += 3.8) {
      for (let z = -44; z >= -66; z -= 4.2) {
        const jitterX = Math.sin(x * 11 + z * 7) * 1.6;
        const jitterZ = Math.cos(x * 13 + z * 5) * 1.6;
        const scale = 0.85 + (Math.sin(x * 3 + z * 9) + 1) * 0.25;
        const type = (x + z) % 2 === 0 ? 'pine' : 'canopy';
        list.push({ x: x + jitterX, z: z + jitterZ, scale, type });
      }
    }

    // 2. South perimeter forest belt (z: 42 to 62)
    for (let x = -70; x <= 70; x += 4.5) {
      for (let z = 44; z <= 62; z += 4.5) {
        const jitterX = Math.sin(x * 7 + z * 11) * 1.8;
        const jitterZ = Math.cos(x * 5 + z * 13) * 1.8;
        const scale = 0.8 + (Math.cos(x * 5 + z * 7) + 1) * 0.3;
        const type = Math.abs(x) > 30 ? 'pine' : 'canopy';
        list.push({ x: x + jitterX, z: z + jitterZ, scale, type });
      }
    }

    // 3. West perimeter green buffer (x: -50 to -78)
    for (let z = -40; z <= 40; z += 4.2) {
      for (let x = -50; x >= -75; x -= 4.8) {
        const jitterX = Math.sin(x * 9 + z * 13) * 1.5;
        const jitterZ = Math.cos(x * 7 + z * 9) * 1.5;
        const scale = 0.85 + (Math.sin(x * 4 + z * 6) + 1) * 0.25;
        list.push({ x: x + jitterX, z: z + jitterZ, scale, type: 'pine' });
      }
    }

    // 4. East perimeter border (x: 48 to 76)
    for (let z = -40; z <= 40; z += 4.5) {
      for (let x = 52; x <= 76; x += 5.0) {
        const jitterX = Math.sin(x * 13 + z * 11) * 1.6;
        const jitterZ = Math.cos(x * 9 + z * 15) * 1.6;
        const scale = 0.9 + (Math.sin(x * 3 + z * 7) + 1) * 0.25;
        list.push({ x: x + jitterX, z: z + jitterZ, scale, type: 'canopy' });
      }
    }

    return list;
  }, []);

  const foliageColor = isLight ? '#2f6046' : '#103822';
  const trunkColor = isLight ? '#5c4533' : '#231a14';

  return (
    <group name="perimeter-forest">
      {/* Instanced or batched tree rendering */}
      {treePositions.map((t, idx) => (
        <group key={`p-tree-${idx}`} position={[t.x, 0, t.z]} scale={[t.scale, t.scale, t.scale]}>
          {/* Tree Trunk */}
          <mesh position={[0, 0.7, 0]} receiveShadow>
            <cylinderGeometry args={[0.2, 0.28, 1.4, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.9} />
          </mesh>

          {/* Foliage - Layered Conifer Pine or Rounded Canopy */}
          {t.type === 'pine' ? (
            <group position={[0, 1.4, 0]}>
              {/* Lower Tier Cone */}
              <mesh position={[0, 0.6, 0]} castShadow>
                <coneGeometry args={[1.5, 2.0, 7]} />
                <meshStandardMaterial color={foliageColor} roughness={0.85} />
              </mesh>
              {/* Mid Tier Cone */}
              <mesh position={[0, 1.6, 0]} castShadow>
                <coneGeometry args={[1.15, 1.8, 7]} />
                <meshStandardMaterial color={isLight ? '#397554' : '#14452a'} roughness={0.85} />
              </mesh>
              {/* Top Tier Cone */}
              <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[0.8, 1.5, 7]} />
                <meshStandardMaterial color={isLight ? '#448c65' : '#1b5635'} roughness={0.85} />
              </mesh>
            </group>
          ) : (
            <group position={[0, 1.8, 0]}>
              {/* Deciduous Spherical Canopy */}
              <mesh position={[0, 0.8, 0]} castShadow>
                <sphereGeometry args={[1.4, 8, 8]} />
                <meshStandardMaterial color={foliageColor} roughness={0.85} />
              </mesh>
              <mesh position={[0.4, 1.4, 0.2]} castShadow>
                <sphereGeometry args={[1.0, 7, 7]} />
                <meshStandardMaterial color={isLight ? '#386f50' : '#16482c'} roughness={0.85} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
