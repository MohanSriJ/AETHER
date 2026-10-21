import React, { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingAsset } from '../../types/city';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getBuildingFacadeTexture } from '../../utils/proceduralTextures';

interface BuildingMeshProps {
  building: BuildingAsset;
}

export const BuildingMesh: React.FC<BuildingMeshProps> = ({ building }) => {
  const selectedAssetId = useSimulationStore(state => state.selectedAssetId);
  const hoveredAssetId = useSimulationStore(state => state.hoveredAssetId);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const setHoveredAsset = useSimulationStore(state => state.setHoveredAsset);
  const showLabels = useSettingsStore(state => state.showLabels);
  const theme = useSettingsStore(state => state.theme);
  const isLight = theme === 'light';

  const beaconRef = useRef<THREE.PointLight>(null);
  const pyramidRef = useRef<THREE.Group>(null);
  const groundRingRef = useRef<THREE.Group>(null);

  // If no asset is selected, bld-c-02 is the featured "Office Building C" from the cockpit reference
  const isOfficeBuildingC = building.id === 'bld-c-02';
  const isSelected = selectedAssetId === building.id || (!selectedAssetId && isOfficeBuildingC);
  const isHovered = hoveredAssetId === building.id;

  // Identify factory / industrial park markers
  const isFactory = building.id === 'bld-i-01' || building.type === 'industrial';
  const isIndustrialPark = building.id === 'bld-i-02' || building.id === 'bld-t-02';

  const facadeTexture = useMemo(() => {
    return getBuildingFacadeTexture(
      isLight ? 'light' : 'dark',
      building.district,
      isSelected ? 'hologram' : 'curtain_wall'
    );
  }, [isLight, building.district, isSelected]);

  // Animated rotation and pulsing for 3D inverted pyramids and ground radar rings
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (beaconRef.current) {
      const flash = Math.sin(elapsed * 4) > 0.3;
      beaconRef.current.intensity = flash
        ? (isSelected ? 3.5 : building.status === 'critical' ? 2.8 : 1.4)
        : 0.15;
    }

    if (pyramidRef.current) {
      pyramidRef.current.rotation.y = elapsed * 1.2;
      pyramidRef.current.position.y = (building.dimensions[1] / 2) + 4.5 + Math.sin(elapsed * 2.5) * 0.4;
    }

    if (groundRingRef.current) {
      groundRingRef.current.rotation.z = -elapsed * 0.8;
      const pulse = 1 + Math.sin(elapsed * 3) * 0.12;
      groundRingRef.current.scale.set(pulse, pulse, 1);
    }
  });

  // Color logic
  const { baseColor, emissiveColor, emissiveIntensity } = useMemo(() => {
    if (building.powerState === 'offline') {
      return isLight
        ? { baseColor: '#64748b', emissiveColor: '#334155', emissiveIntensity: 0 }
        : { baseColor: '#080d14', emissiveColor: '#000000', emissiveIntensity: 0 };
    }

    if (building.fireSeverity > 0) {
      const heat = Math.min(1, building.fireSeverity / 100);
      return isLight
        ? { baseColor: '#fb923c', emissiveColor: '#ea580c', emissiveIntensity: 0.6 + heat * 0.7 }
        : { baseColor: '#2b1014', emissiveColor: '#ff4d4d', emissiveIntensity: 0.7 + heat * 0.8 };
    }

    if (building.floodDepth > 0) {
      return isLight
        ? { baseColor: '#7dd3fc', emissiveColor: '#0284c7', emissiveIntensity: 0.55 }
        : { baseColor: '#0b233a', emissiveColor: '#38bdf8', emissiveIntensity: 0.55 };
    }

    if (building.status === 'critical') {
      return isLight
        ? { baseColor: '#f87171', emissiveColor: '#dc2626', emissiveIntensity: 0.7 }
        : { baseColor: '#2d111a', emissiveColor: '#ff647c', emissiveIntensity: 0.85 };
    }

    if (building.status === 'warning') {
      return isLight
        ? { baseColor: '#fde047', emissiveColor: '#d97706', emissiveIntensity: 0.55 }
        : { baseColor: '#292011', emissiveColor: '#ffbf69', emissiveIntensity: 0.6 };
    }

    // Default theme colors
    if (isLight) {
      return { baseColor: '#ffffff', emissiveColor: '#0284c7', emissiveIntensity: 0.25 };
    }
    return { baseColor: '#121b2d', emissiveColor: '#38bdf8', emissiveIntensity: 0.35 };
  }, [building.status, building.powerState, building.fireSeverity, building.floodDepth, isLight]);

  const [w, h, d] = building.dimensions;
  const isTall = h > 16;
  const hasHelipad = building.id === 'bld-t-01';

  // Compute telemetry display output for the callout card
  const outputValue = (building.powerConsumptionMw * 76191783).toLocaleString('en-US', {
    maximumFractionDigits: 0
  });

  return (
    <group position={building.position}>
      {/* 1. Ground Architectural Base / Entrance Podium */}
      <mesh position={[0, -h / 2 + 0.6, 0]} receiveShadow>
        <boxGeometry args={[w * 1.15, 1.2, d * 1.15]} />
        <meshStandardMaterial
          color={isLight ? '#cbd5e1' : '#0c1424'}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>

      {/* 2. Glass Entrance Canopy Overhang */}
      <mesh position={[0, -h / 2 + 1.4, d * 0.55]} receiveShadow>
        <boxGeometry args={[w * 0.6, 0.15, 1.8]} />
        <meshStandardMaterial
          color={isLight ? '#0284c7' : '#00f0ff'}
          emissive={isLight ? '#0284c7' : '#00e5ff'}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 3. Main Building Shaft */}
      {isSelected ? (
        /* HOLOGRAPHIC FOCUS BUILDING (Matches "Office Building C" from Cockpit Reference) */
        <group>
          {/* Translucent Glowing Cyan Body */}
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              selectAsset(building.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAsset(building.id);
            }}
            onPointerOut={() => setHoveredAsset(null)}
          >
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00e5ff"
              emissiveIntensity={0.65}
              transparent
              opacity={0.42}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* High-Density Luminous Outer Cyan Wireframe Grid */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(w * 1.002, h * 1.002, d * 1.002)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={3} />
          </lineSegments>

          {/* Interior Glowing Floor Grid Slices (Floor Slabs) */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
            <mesh key={`slab-${idx}`} position={[0, -h / 2 + h * ratio, 0]}>
              <boxGeometry args={[w * 0.98, 0.15, d * 0.98]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
            </mesh>
          ))}

          {/* Glowing Target Reticle on the Roof Corner */}
          <group position={[w / 2, h / 2 + 0.1, d / 2]}>
            {/* Concentric Pulsing Cyan/White Target Rings */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.5, 24]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.7, 0.85, 24]} />
              <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
            <pointLight color="#00f0ff" intensity={3.5} distance={10} />
          </group>

          {/* Leader-Line Callout Card Tethered to the Corner Target (Exact Smart City Cockpit Style) */}
          <Html
            position={[w / 2, h / 2 + 0.2, d / 2]}
            center={false}
            distanceFactor={55}
            className="pointer-events-none select-none"
          >
            <div className="relative -top-28 left-8 flex items-start animate-fadeIn">
              {/* Angled SVG Leader Line */}
              <svg className="absolute -left-8 top-16 w-12 h-16 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                {/* Horizontal & Diagonal Connector Line */}
                <path
                  d="M -4 40 L 14 16 L 36 16"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="2 2"
                />
                {/* Pin Target Dot at Building Anchor */}
                <circle cx="-4" cy="40" r="3.5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
              </svg>

              {/* High-Tech Cockpit HUD Callout Box */}
              <div className="relative z-10 w-64 p-3 rounded-lg bg-[#071326]/95 border border-[#00f0ff]/80 shadow-[0_0_25px_rgba(0,240,255,0.35)] backdrop-blur-md text-white font-sans">
                {/* Title & Status Indicator */}
                <div className="flex items-center justify-between pb-1.5 border-b border-[#00f0ff]/30">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
                    <span className="font-bold text-xs tracking-wider text-[#e2e8f0]">
                      {isOfficeBuildingC ? 'Office Building C' : building.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] uppercase">
                    Active Twin
                  </span>
                </div>

                {/* Subtitle & Value Metrics */}
                <div className="mt-2 text-[11px] text-[#94a3b8] flex justify-between">
                  <span>Industrial Output Value</span>
                  <span className="text-[#00f0ff] font-mono font-semibold">32%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mt-1 mb-2">
                  <div className="bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] h-full w-[32%]" />
                </div>

                {/* Big Metric Display */}
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-mono font-bold tracking-tight text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                    {outputValue === '0' ? '365,720,560' : outputValue}
                  </span>
                  <span className="text-[9px] text-[#94a3b8] font-mono uppercase">Telemetry Synced</span>
                </div>
              </div>
            </div>
          </Html>
        </group>
      ) : (
        /* STANDARD MODERN COMMERCIAL TOWER (Realistic Curtain-Wall Grid with CAD Edge Definition) */
        <group scale={isHovered ? [1.02, 1.01, 1.02] : [1, 1, 1]}>
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              selectAsset(building.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAsset(building.id);
            }}
            onPointerOut={() => {
              setHoveredAsset(null);
            }}
          >
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              map={facadeTexture}
              color={baseColor}
              emissive={emissiveColor}
              emissiveMap={facadeTexture}
              emissiveIntensity={emissiveIntensity}
              roughness={isLight ? 0.3 : 0.25}
              metalness={isLight ? 0.4 : 0.7}
            />
          </mesh>
          {/* Crisp Architectural Structural Edge Lines */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(w * 1.001, h * 1.001, d * 1.001)]} />
            <lineBasicMaterial
              color={isLight ? '#64748b' : '#38bdf8'}
              transparent
              opacity={isLight ? 0.25 : 0.35}
            />
          </lineSegments>
        </group>
      )}

      {/* 4. Stepped Architectural Crown & Rooftop Equipment */}
      {isTall && !isSelected && (
        <group position={[0, h / 2 + h * 0.08, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[w * 0.75, h * 0.16, d * 0.75]} />
            <meshStandardMaterial
              map={facadeTexture}
              color={baseColor}
              emissive={emissiveColor}
              emissiveMap={facadeTexture}
              emissiveIntensity={emissiveIntensity * 1.1}
              roughness={0.25}
              metalness={0.7}
            />
          </mesh>
          {/* Mechanical Penthouse HVAC Chillers */}
          <mesh position={[w * 0.18, (h * 0.16) / 2 + 0.45, -d * 0.18]} castShadow>
            <boxGeometry args={[w * 0.3, 0.9, d * 0.3]} />
            <meshStandardMaterial color={isLight ? '#64748b' : '#1e293b'} roughness={0.8} />
          </mesh>
        </group>
      )}

      {/* 5. Helipad on Trauma Center */}
      {hasHelipad && (
        <group position={[0, h / 2 + 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[w * 0.38, 24]} />
            <meshStandardMaterial color={isLight ? '#64748b' : '#1e293b'} roughness={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[w * 0.32, w * 0.35, 24]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      )}

      {/* 6. Rooftop Warning Spire & Flashing Light */}
      <mesh position={[0, isTall ? h / 2 + h * 0.16 + 1.2 : h / 2 + 1, 0]}>
        <cylinderGeometry args={[0.08, 0.22, 2.4, 8]} />
        <meshStandardMaterial
          color={isLight ? '#0284c7' : '#00f0ff'}
          emissive={building.status === 'critical' ? '#ff4d4d' : isLight ? '#0284c7' : '#00f0ff'}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        ref={beaconRef}
        position={[0, isTall ? h / 2 + h * 0.16 + 2.2 : h / 2 + 2, 0]}
        color={building.status === 'critical' ? '#ff4d4d' : isLight ? '#0284c7' : '#00f0ff'}
        intensity={isSelected ? 3.5 : 1.2}
        distance={22}
      />

      {/* 7. 3D Inverted Pyramid & Ground Radar Pulse (For Factory / Industrial Assets) */}
      {isFactory && (
        <group>
          {/* Floating Orange Inverted Pyramid */}
          <group ref={pyramidRef}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[1.5, 2.4, 4]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={1.8}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Pyramid Core Light */}
            <pointLight color="#f59e0b" intensity={2.5} distance={15} />

            {/* In-scene Label Tag */}
            <Html position={[0, 1.8, 0]} center distanceFactor={60}>
              <div className="pointer-events-none px-2 py-0.5 rounded-full bg-[#f59e0b]/90 text-black font-bold text-[10px] tracking-wider uppercase shadow-lg shadow-orange-500/50">
                Factory
              </div>
            </Html>
          </group>

          {/* Concentric Rotating Radar Rings on the Ground Pavement */}
          <group ref={groundRingRef} position={[0, -h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[w * 0.7, w * 0.76, 32]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <ringGeometry args={[w * 0.95, w * 1.02, 32]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      )}

      {/* 8. Floating Green Inverted Pyramid for Industrial Park */}
      {isIndustrialPark && (
        <group>
          <group ref={pyramidRef}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[1.4, 2.2, 4]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={1.6}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <Html position={[0, 1.8, 0]} center distanceFactor={60}>
              <div className="pointer-events-none px-2 py-0.5 rounded-full bg-[#10b981]/90 text-black font-bold text-[10px] tracking-wider uppercase shadow-lg shadow-emerald-500/50">
                Industrial Park
              </div>
            </Html>
          </group>
          <group ref={groundRingRef} position={[0, -h / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[w * 0.7, w * 0.76, 32]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      )}

      {/* 9. Floating Isometric 3D Hexagonal Telemetry Badges (As in the Reference Image) */}
      {!isSelected && showLabels && (building.id === 'bld-c-01' || building.id === 'bld-c-05') && (
        <Html position={[0, h / 2 + 4.2, 0]} center distanceFactor={65}>
          <div className="pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#071326]/90 border border-[#38bdf8]/60 shadow-[0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-md text-white font-mono text-[11px] whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full ${building.id === 'bld-c-01' ? 'bg-[#f59e0b]' : 'bg-[#00f0ff]'}`} />
            <span className="text-[#e2e8f0] font-semibold">
              {building.id === 'bld-c-01' ? '562,320,480' : '250,448,220'}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
