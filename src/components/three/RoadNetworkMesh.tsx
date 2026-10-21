import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoadIntersection, RoadSegment } from '../../types/routing';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';

interface RoadNetworkMeshProps {
  intersections: RoadIntersection[];
  segments: RoadSegment[];
}

// Animated Dynamic Traffic Particles Traversing City Road Grid
const CityTrafficParticles: React.FC<{
  segments: RoadSegment[];
  nodeMap: Map<string, RoadIntersection>;
  isLight: boolean;
}> = ({ segments, nodeMap, isLight }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Filter to active drivable segments
  const activeSegments = useMemo(() => {
    return segments.filter(s => s.status !== 'blocked').map(s => {
      const from = nodeMap.get(s.fromNode);
      const to = nodeMap.get(s.toNode);
      return {
        id: s.id,
        isFlooded: s.status === 'flooded',
        from: from ? new THREE.Vector3(from.position[0], 0.22, from.position[1]) : null,
        to: to ? new THREE.Vector3(to.position[0], 0.22, to.position[1]) : null,
      };
    }).filter(s => s.from && s.to);
  }, [segments, nodeMap]);

  // Create particle positions buffer: 2 vehicles per segment
  const particleCount = activeSegments.length * 2;
  const { positions, colors, offsets } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const off = new Float32Array(particleCount);

    const cyan = new THREE.Color(isLight ? '#0284c7' : '#00f0ff');
    const amber = new THREE.Color(isLight ? '#d97706' : '#f59e0b');

    for (let i = 0; i < activeSegments.length; i++) {
      const seg = activeSegments[i];
      // Vehicle A (heading forward)
      const idxA = i * 2;
      pos[idxA * 3] = seg.from!.x;
      pos[idxA * 3 + 1] = 0.22;
      pos[idxA * 3 + 2] = seg.from!.z;
      col[idxA * 3] = cyan.r;
      col[idxA * 3 + 1] = cyan.g;
      col[idxA * 3 + 2] = cyan.b;
      off[idxA] = (i * 0.17) % 1;

      // Vehicle B (heading reverse)
      const idxB = i * 2 + 1;
      pos[idxB * 3] = seg.to!.x;
      pos[idxB * 3 + 1] = 0.22;
      pos[idxB * 3 + 2] = seg.to!.z;
      col[idxB * 3] = amber.r;
      col[idxB * 3 + 1] = amber.g;
      col[idxB * 3 + 2] = amber.b;
      off[idxB] = (i * 0.31 + 0.5) % 1;
    }

    return { positions: pos, colors: col, offsets: off };
  }, [activeSegments, particleCount, isLight]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const time = clock.getElapsedTime() * 0.45;

    for (let i = 0; i < activeSegments.length; i++) {
      const seg = activeSegments[i];
      if (!seg.from || !seg.to) continue;

      // Vehicle A (forward)
      const idxA = i * 2;
      const progressA = (time + offsets[idxA]) % 1;
      const xA = THREE.MathUtils.lerp(seg.from.x, seg.to.x, progressA);
      const zA = THREE.MathUtils.lerp(seg.from.z, seg.to.z, progressA);
      posAttr.setXYZ(idxA, xA, 0.22, zA);

      // Vehicle B (reverse)
      const idxB = i * 2 + 1;
      const progressB = (time + offsets[idxB]) % 1;
      const xB = THREE.MathUtils.lerp(seg.to.x, seg.from.x, progressB);
      const zB = THREE.MathUtils.lerp(seg.to.z, seg.from.z, progressB);
      posAttr.setXYZ(idxB, xB, 0.22, zB);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isLight ? 0.9 : 1.2}
        vertexColors
        transparent
        opacity={isLight ? 0.85 : 0.95}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
};

// Animated Waterfront Marina Basin Water Surface
const WaterfrontMarinaBasin: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!waterRef.current) return;
    const t = clock.getElapsedTime();
    const mat = waterRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.roughness = 0.08 + Math.sin(t * 1.5) * 0.03;
      mat.opacity = (isLight ? 0.82 : 0.88) + Math.cos(t * 2) * 0.03;
    }
  });

  return (
    <group position={[-10, 0.04, -58]}>
      {/* Water Surface Plane with Specular Sheen */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 50, 32, 16]} />
        <meshStandardMaterial
          color={isLight ? '#0284c7' : '#061d36'}
          emissive={isLight ? '#0369a1' : '#03395e'}
          emissiveIntensity={isLight ? 0.15 : 0.4}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={isLight ? 0.82 : 0.88}
        />
      </mesh>

      {/* Decorative Promenade Seawall Rim */}
      <mesh position={[0, 0.2, 25]} receiveShadow>
        <boxGeometry args={[130, 0.4, 1.2]} />
        <meshStandardMaterial color={isLight ? '#cbd5e1' : '#1e293b'} roughness={0.7} />
      </mesh>
    </group>
  );
};

export const RoadNetworkMesh: React.FC<RoadNetworkMeshProps> = ({ intersections, segments }) => {
  const nodeMap = useMemo(() => new Map(intersections.map(n => [n.id, n])), [intersections]);
  const activeRoute = useSimulationStore(state => state.activeRoute);
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  return (
    <group name="road-network">
      {/* 1. Deep Asphalt Ground Base Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial
          color={isLight ? '#cbd5e1' : '#080d17'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Campus Plaza Paving (Center Tech Park Zone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[140, 110]} />
        <meshStandardMaterial
          color={isLight ? '#e2e8f0' : '#0e1626'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* 3. Subtle Technical Grid Matrix on Campus Pavement */}
      <gridHelper
        args={isLight ? [220, 44, '#94a3b8', '#cbd5e1'] : [220, 44, '#1b2a45', '#0c1524']}
        position={[0, 0.01, 0]}
      />

      {/* 4. Realistic Animated Waterfront Marina Basin */}
      <WaterfrontMarinaBasin isLight={isLight} />

      {/* 5. Dynamic Smart City Autonomous Traffic Flow */}
      <CityTrafficParticles segments={segments} nodeMap={nodeMap} isLight={isLight} />

      {/* 6. Road Segments with Asphalt, Painted Markings, and Curbs */}
      {segments.map((seg) => {
        const fromNode = nodeMap.get(seg.fromNode);
        const toNode = nodeMap.get(seg.toNode);
        if (!fromNode || !toNode) return null;

        const p1 = new THREE.Vector3(fromNode.position[0], 0.08, fromNode.position[1]);
        const p2 = new THREE.Vector3(toNode.position[0], 0.08, toNode.position[1]);

        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const length = p1.distanceTo(p2);
        const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);

        const isPartOfActiveRoute = activeRoute?.pathSegments.includes(seg.id);
        const isFlooded = seg.status === 'flooded';
        const isBlocked = seg.status === 'blocked';

        let roadColor = isLight ? '#334155' : '#0b111a';
        let roadEmissive = '#000000';
        let emissiveIntensity = 0;

        if (isPartOfActiveRoute) {
          roadEmissive = '#00f0ff';
          emissiveIntensity = 0.7;
        } else if (isBlocked) {
          roadColor = isLight ? '#fca5a5' : '#241215';
          roadEmissive = '#ff647c';
          emissiveIntensity = 0.55;
        } else if (isFlooded) {
          roadColor = isLight ? '#7dd3fc' : '#0d253a';
          roadEmissive = '#38bdf8';
          emissiveIntensity = 0.45;
        }

        const roadWidth = seg.lanes >= 4 ? 4.8 : 3.4;

        return (
          <group key={seg.id} position={mid} rotation={[-Math.PI / 2, 0, -angle]}>
            {/* Asphalt Road Surface */}
            <mesh receiveShadow position={[0, 0, 0]}>
              <planeGeometry args={[length, roadWidth]} />
              <meshStandardMaterial
                color={roadColor}
                emissive={roadEmissive}
                emissiveIntensity={emissiveIntensity}
                roughness={0.85}
                metalness={0.2}
              />
            </mesh>

            {/* White Dashed Centerline Marking */}
            {!isBlocked && !isFlooded && (
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[length * 0.95, 0.18]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={isLight ? 0.9 : 0.8}
                />
              </mesh>
            )}

            {/* Raised Road Curbs on Both Edges */}
            <mesh position={[0, roadWidth / 2 + 0.15, 0.05]}>
              <boxGeometry args={[length, 0.3, 0.1]} />
              <meshStandardMaterial color={isLight ? '#94a3b8' : '#1e293b'} roughness={0.7} />
            </mesh>
            <mesh position={[0, -roadWidth / 2 - 0.15, 0.05]}>
              <boxGeometry args={[length, 0.3, 0.1]} />
              <meshStandardMaterial color={isLight ? '#94a3b8' : '#1e293b'} roughness={0.7} />
            </mesh>

            {/* Street Lamp Fixture on Road Midpoint */}
            <group position={[0, roadWidth / 2 + 0.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.2]}>
                <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
                <meshStandardMaterial color={isLight ? '#64748b' : '#334155'} />
              </mesh>
              {/* Lamp Luminaire Head */}
              <mesh position={[0, -0.3, 2.3]}>
                <boxGeometry args={[0.25, 0.45, 0.1]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive={isLight ? '#bae6fd' : '#54e7f2'}
                  emissiveIntensity={1.2}
                />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* 6. Intersection Pedestrian Nodes & Crosswalks */}
      {intersections.map((node) => (
        <group key={node.id} position={[node.position[0], 0.09, node.position[1]]}>
          {/* Intersection Slab */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.5, 16]} />
            <meshStandardMaterial
              color={isLight ? '#334155' : '#0e1624'}
              roughness={0.8}
            />
          </mesh>
          {/* Signal Indicator Dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[0.4, 12]} />
            <meshBasicMaterial
              color={node.isKeyDepot ? '#54e7f2' : '#f59e0b'}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
