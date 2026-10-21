import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSettingsStore } from '../../store/settingsStore';
import { getBuildingFacadeTexture } from '../../utils/proceduralTextures';

// Architectural Skyscraper Model Definition
interface SkyscraperDef {
  pos: [number, number, number];
  baseDim: [number, number, number];
  tierDim?: [number, number, number];
  crownType?: 'spire' | 'helipad' | 'stepped' | 'atrium';
  district: 'central' | 'waterfront' | 'industrial' | 'tech_quad';
}

const HERO_SKYSCRAPERS: SkyscraperDef[] = [
  // Central Main Tower (Apex Spire)
  {
    pos: [0, 0, 0],
    baseDim: [8, 32, 8],
    tierDim: [5.5, 8, 5.5],
    crownType: 'spire',
    district: 'central'
  },
  // Commercial High-Rise East
  {
    pos: [14, 0, 8],
    baseDim: [7, 24, 7],
    tierDim: [5, 6, 5],
    crownType: 'helipad',
    district: 'central'
  },
  // Coastal Maritime Tower West
  {
    pos: [-14, 0, 9],
    baseDim: [7.5, 20, 7.5],
    tierDim: [5, 5, 5],
    crownType: 'stepped',
    district: 'waterfront'
  },
  // Innovation Tower North-East
  {
    pos: [12, 0, -12],
    baseDim: [6.5, 18, 6.5],
    tierDim: [4.5, 4, 4.5],
    crownType: 'atrium',
    district: 'tech_quad'
  },
  // High-Tech R&D Tower North-West
  {
    pos: [-12, 0, -10],
    baseDim: [7, 26, 7],
    tierDim: [5, 6, 5],
    crownType: 'spire',
    district: 'central'
  },
  // Industrial Substation Tower Far East
  {
    pos: [24, 0, -1],
    baseDim: [6, 13, 6],
    crownType: 'stepped',
    district: 'industrial'
  },
  // Waterfront Marina Block Far West
  {
    pos: [-24, 0, 1],
    baseDim: [6.5, 15, 6.5],
    crownType: 'atrium',
    district: 'waterfront'
  },
  // South Civic Atrium
  {
    pos: [1, 0, 19],
    baseDim: [9, 10, 7],
    crownType: 'helipad',
    district: 'central'
  },
  // North Terminal Hub
  {
    pos: [0, 0, -20],
    baseDim: [10, 11, 7],
    crownType: 'stepped',
    district: 'waterfront'
  }
];

// Moving traffic light pulses simulating living city flow
const TrafficFlowMesh: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const trafficGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!trafficGroupRef.current) return;
    const t = clock.getElapsedTime() * 12;
    trafficGroupRef.current.children.forEach((mesh, idx) => {
      const offset = (idx * 8 + t) % 80 - 40;
      if (idx % 2 === 0) {
        mesh.position.x = offset;
      } else {
        mesh.position.z = offset;
      }
    });
  });

  return (
    <group ref={trafficGroupRef}>
      {[-12, -4, 4, 12, 20, 28].map((val, i) => (
        <mesh
          key={i}
          position={[i % 2 === 0 ? val : 10, 0.2, i % 2 === 0 ? 10 : val]}
        >
          <sphereGeometry args={[0.22, 6, 6]} />
          <meshBasicMaterial
            color={
              i % 4 === 0
                ? '#ff4d4d' // red taillights
                : i % 4 === 1
                ? (isDark ? '#54e7f2' : '#0284c7') // headlights
                : '#fef08a' // warm headlights
            }
          />
        </mesh>
      ))}
    </group>
  );
};

// Skyscraper Unit with Realistic Facade, Mechanical Penthouses & Spire Beacons
const RealisticSkyscraper: React.FC<{
  def: SkyscraperDef;
  isDark: boolean;
}> = ({ def, isDark }) => {
  const [w, h, d] = def.baseDim;
  const beaconRef = useRef<THREE.PointLight>(null);

  const texture = useMemo(() => {
    return getBuildingFacadeTexture(isDark ? 'dark' : 'light', def.district);
  }, [isDark, def.district]);

  // Synchronized flashing warning beacon
  useFrame(({ clock }) => {
    if (beaconRef.current) {
      const flash = Math.sin(clock.getElapsedTime() * 4) > 0.4;
      beaconRef.current.intensity = flash ? (isDark ? 2.5 : 1.8) : 0.1;
    }
  });

  const podiumH = 2.2;
  const towerH = h - podiumH;

  return (
    <group position={def.pos}>
      {/* 1. Street-Level Architectural Podium Base */}
      <mesh position={[0, podiumH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.08, podiumH, d * 1.08]} />
        <meshStandardMaterial
          color={isDark ? '#0b1322' : '#cbd5e1'}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* 2. Main High-Rise Tower Shaft with Window Texture */}
      <mesh position={[0, podiumH + towerH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, towerH, d]} />
        <meshStandardMaterial
          map={texture}
          roughness={isDark ? 0.2 : 0.3}
          metalness={isDark ? 0.7 : 0.5}
          color={isDark ? '#ffffff' : '#f8fafc'}
          emissive={isDark ? '#54e7f2' : '#0284c7'}
          emissiveMap={texture}
          emissiveIntensity={isDark ? 0.45 : 0.12}
        />
      </mesh>

      {/* 3. Stepped Setback Tier (if defined) */}
      {def.tierDim && (
        <mesh
          position={[0, podiumH + towerH + def.tierDim[1] / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={def.tierDim} />
          <meshStandardMaterial
            map={texture}
            roughness={0.25}
            metalness={0.65}
            color={isDark ? '#e2e8f0' : '#ffffff'}
            emissive={isDark ? '#9d8cff' : '#7c3aed'}
            emissiveMap={texture}
            emissiveIntensity={isDark ? 0.5 : 0.15}
          />
        </mesh>
      )}

      {/* 4. Rooftop Mechanical Equipment & Architectural Crown */}
      {def.crownType === 'spire' && (
        <group position={[0, h + (def.tierDim ? def.tierDim[1] : 0), 0]}>
          {/* Mechanical Penthouse */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[w * 0.45, 1.4, d * 0.45]} />
            <meshStandardMaterial color={isDark ? '#141e33' : '#94a3b8'} roughness={0.7} />
          </mesh>
          {/* Communications Mast / Spire */}
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.22, 5.5, 8]} />
            <meshStandardMaterial
              color={isDark ? '#9d8cff' : '#0284c7'}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
          {/* Blinking Aviation Obstruction Beacon */}
          <mesh position={[0, 6.8, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial color="#ff4d4d" />
          </mesh>
          <pointLight
            ref={beaconRef}
            position={[0, 7, 0]}
            color="#ff4d4d"
            intensity={2}
            distance={15}
          />
        </group>
      )}

      {def.crownType === 'helipad' && (
        <group position={[0, h + (def.tierDim ? def.tierDim[1] : 0) + 0.08, 0]}>
          {/* Helipad Platform */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[w * 0.38, 24]} />
            <meshStandardMaterial color={isDark ? '#1e293b' : '#64748b'} roughness={0.8} />
          </mesh>
          {/* Yellow Safety Perimeter Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[w * 0.33, w * 0.36, 24]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          {/* Rooftop HVAC Units */}
          <mesh position={[w * 0.3, 0.4, -d * 0.3]} castShadow>
            <boxGeometry args={[1.2, 0.8, 1.2]} />
            <meshStandardMaterial color={isDark ? '#0f172a' : '#94a3b8'} roughness={0.8} />
          </mesh>
        </group>
      )}

      {def.crownType === 'atrium' && (
        <group position={[0, h + (def.tierDim ? def.tierDim[1] : 0) + 0.5, 0]}>
          <mesh castShadow>
            <coneGeometry args={[w * 0.35, 1.8, 4]} />
            <meshStandardMaterial
              color={isDark ? '#54e7f2' : '#38bdf8'}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>
      )}

      {def.crownType === 'stepped' && (
        <group position={[0, h + (def.tierDim ? def.tierDim[1] : 0) + 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[w * 0.5, 0.8, d * 0.5]} />
            <meshStandardMaterial color={isDark ? '#141e33' : '#94a3b8'} roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Complete City Cluster with Streets, Plaza Pavements, and Dynamic Atmosphere
const HeroCityCluster: React.FC = () => {
  const clusterRef = useRef<THREE.Group>(null);
  const reducedMotion = useSettingsStore(state => state.reducedMotion);
  const theme = useSettingsStore(state => state.theme);
  const isDark = theme === 'dark';

  useFrame(({ clock }) => {
    if (clusterRef.current && !reducedMotion) {
      clusterRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <group ref={clusterRef}>
      {/* 1. Base Ground Plaza Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[110, 110]} />
        <meshStandardMaterial
          color={isDark ? '#080d17' : '#e2e8f0'}
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Architectural Drafting Grid Helper */}
      <gridHelper
        args={[110, 22, isDark ? '#1b2a45' : '#94a3b8', isDark ? '#0c1524' : '#cbd5e1']}
        position={[0, 0.01, 0]}
      />

      {/* 3. Asphalt Arterial Avenues with Road Markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 10]} receiveShadow>
        <planeGeometry args={[90, 4.5]} />
        <meshStandardMaterial color={isDark ? '#101726' : '#334155'} roughness={0.7} />
      </mesh>
      {/* Road Centerline (Dashed Yellow/White) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 10]}>
        <planeGeometry args={[86, 0.2]} />
        <meshBasicMaterial color={isDark ? '#54e7f2' : '#fef08a'} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.04, 0]} receiveShadow>
        <planeGeometry args={[4.5, 90]} />
        <meshStandardMaterial color={isDark ? '#101726' : '#334155'} roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.06, 0]}>
        <planeGeometry args={[0.2, 86]} />
        <meshBasicMaterial color={isDark ? '#9d8cff' : '#fef08a'} />
      </mesh>

      {/* 4. Moving Vehicular Light Streams */}
      <TrafficFlowMesh isDark={isDark} />

      {/* 5. Waterfront Canal / Marina Basin on South Perimeter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, -36]} receiveShadow>
        <planeGeometry args={[95, 24]} />
        <meshStandardMaterial
          color={isDark ? '#0c2742' : '#0284c7'}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={isDark ? 0.88 : 0.75}
        />
      </mesh>

      {/* 6. Realistic Skyscraper Geometry with Procedural Windows */}
      {HERO_SKYSCRAPERS.map((def, idx) => (
        <RealisticSkyscraper key={idx} def={def} isDark={isDark} />
      ))}

      {/* 7. Precision Spatial Radar Hologram Rings */}
      <mesh position={[0, 36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16, 16.3, 64]} />
        <meshBasicMaterial
          color={isDark ? '#54e7f2' : '#0284c7'}
          side={THREE.DoubleSide}
          transparent
          opacity={isDark ? 0.45 : 0.28}
        />
      </mesh>
      <mesh position={[0, 36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[28, 28.3, 64]} />
        <meshBasicMaterial
          color={isDark ? '#9d8cff' : '#7c3aed'}
          side={THREE.DoubleSide}
          transparent
          opacity={isDark ? 0.3 : 0.18}
        />
      </mesh>
    </group>
  );
};

export const HeroScene: React.FC = () => {
  const theme = useSettingsStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [28, 34, 42], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            maxPolarAngle={Math.PI / 2.15}
            minPolarAngle={Math.PI / 4.5}
            dampingFactor={0.06}
          />

          {/* Realistic Multi-Source Lighting Setup */}
          <ambientLight
            color={isDark ? '#0d182b' : '#ffffff'}
            intensity={isDark ? 1.1 : 1.6}
          />
          <directionalLight
            position={[35, 55, 30]}
            intensity={isDark ? 2.2 : 2.0}
            color="#ffffff"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={10}
            shadow-camera-far={120}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={40}
            shadow-camera-bottom={-40}
          />
          {/* Secondary atmospheric cyan fill */}
          <directionalLight
            position={[-30, 25, -25]}
            intensity={isDark ? 0.9 : 0.7}
            color={isDark ? '#54e7f2' : '#0284c7'}
          />
          {/* Distant violet rim light */}
          <pointLight
            position={[0, 35, 0]}
            intensity={isDark ? 2.2 : 1.2}
            distance={70}
            color={isDark ? '#9d8cff' : '#7c3aed'}
          />

          <HeroCityCluster />
        </Suspense>
      </Canvas>
    </div>
  );
};
