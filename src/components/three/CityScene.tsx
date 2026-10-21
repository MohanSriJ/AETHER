import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';
import { useSettingsStore, AppTheme } from '../../store/settingsStore';
import { BuildingMesh } from './BuildingMesh';
import { RoadNetworkMesh } from './RoadNetworkMesh';
import { SensorMarkerMesh } from './SensorMarkerMesh';
import { HazardOverlayMesh } from './HazardOverlayMesh';
import { RouteMesh } from './RouteMesh';
import { PerimeterForestMesh } from './PerimeterForestMesh';

// Smooth Cinematic Camera Controller with Exponential Damping
const CameraController: React.FC = () => {
  const cameraPreset = useSimulationStore(state => state.cameraPreset);
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const autoRotate = useSettingsStore(state => state.autoRotate);

  // Default to the isometric three-quarters perspective matching the Smart City Cockpit reference
  const targetCamPos = useRef(new THREE.Vector3(26, 36, 46));
  const targetLookAt = useRef(new THREE.Vector3(2, 8, 2));
  const isTransitioning = useRef(false);

  useEffect(() => {
    switch (cameraPreset) {
      case 'central':
        targetCamPos.current.set(22, 32, 42);
        targetLookAt.current.set(4, 10, 2);
        break;
      case 'waterfront':
        targetCamPos.current.set(-25, 22, -15);
        targetLookAt.current.set(-20, 2, -45);
        break;
      case 'industrial':
        targetCamPos.current.set(50, 26, 15);
        targetLookAt.current.set(55, 4, 0);
        break;
      case 'tech_quad':
        targetCamPos.current.set(-35, 28, 48);
        targetLookAt.current.set(-30, 8, 35);
        break;
      case 'overview':
      default:
        targetCamPos.current.set(26, 36, 46);
        targetLookAt.current.set(2, 8, 2);
        break;
    }
    isTransitioning.current = true;
  }, [cameraPreset]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const factor = Math.min(1, delta * 3.5);
      camera.position.lerp(targetCamPos.current, factor);
      controlsRef.current.target.lerp(targetLookAt.current, factor);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetCamPos.current) < 0.2) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05} // Prevent sinking below ground
      minDistance={10}
      maxDistance={140}
      autoRotate={autoRotate}
      autoRotateSpeed={0.6}
    />
  );
};

// Responsive Scene Environment & Fog tuned for the Cockpit Display
const SceneEnvironment: React.FC<{ theme: AppTheme }> = ({ theme }) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (theme === 'light') {
      gl.setClearColor('#F8FAFC');
      scene.fog = new THREE.FogExp2('#F8FAFC', 0.007);
    } else {
      // Deep nocturnal smart-city cockpit atmosphere
      gl.setClearColor('#050a14');
      scene.fog = new THREE.FogExp2('#050a14', 0.008);
    }
  }, [theme, gl, scene]);

  return (
    <>
      <ambientLight
        color={theme === 'light' ? '#d4dbe8' : '#0c1a2e'}
        intensity={theme === 'light' ? 1.3 : 1.1}
      />
      {/* Key directional sunlight/moonlight */}
      <directionalLight
        position={[45, 65, 40]}
        intensity={theme === 'light' ? 2.1 : 2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={10}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      {/* Soft cyan atmospheric fill light */}
      <directionalLight
        position={[-40, 35, -35]}
        intensity={theme === 'light' ? 0.7 : 0.8}
        color={theme === 'light' ? '#38bdf8' : '#00f0ff'}
      />
      {/* Point light accent over the campus center */}
      <pointLight
        position={[10, 35, 10]}
        intensity={theme === 'light' ? 1.0 : 1.6}
        distance={90}
        color="#00f0ff"
      />
    </>
  );
};

// Urban Plazas, Campus Greens & Landscaped Terraces
const UrbanLandscapeFeatures: React.FC<{ theme: AppTheme }> = ({ theme }) => {
  const isLight = theme === 'light';

  return (
    <group name="urban-landscaping">
      {/* Central Campus Courtyard Lawn */}
      <mesh position={[0, 0.05, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 16]} />
        <meshStandardMaterial color={isLight ? '#c7d2c8' : '#0e2b1c'} roughness={0.9} />
      </mesh>

      {/* Tech Campus Pathway Plaza */}
      <mesh position={[18, 0.06, 12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color={isLight ? '#e2e8f0' : '#111a2c'} roughness={0.7} />
      </mesh>

      {/* Waterfront Boardwalk Strip */}
      <mesh position={[-15, 0.08, -36]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[65, 4.5]} />
        <meshStandardMaterial color={isLight ? '#cbd5e1' : '#172338'} roughness={0.7} />
      </mesh>

      {/* Heavy Substation Industrial Ground Pad */}
      <mesh position={[58, 0.05, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 34]} />
        <meshStandardMaterial color={isLight ? '#94a3b8' : '#13151f'} roughness={0.8} metalness={0.3} />
      </mesh>
    </group>
  );
};

export const CityScene: React.FC = () => {
  const buildings = useSimulationStore(state => state.buildings);
  const sensors = useSimulationStore(state => state.sensors);
  const roadIntersections = useSimulationStore(state => state.roadIntersections);
  const roadSegments = useSimulationStore(state => state.roadSegments);
  const layerVisibility = useSimulationStore(state => state.layerVisibility);
  const selectAsset = useSimulationStore(state => state.selectAsset);
  const theme = useSettingsStore(state => state.theme);

  return (
    <div
      className="relative w-full h-full select-none"
      onClick={() => selectAsset(null)}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [26, 36, 46], fov: 38 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <SceneEnvironment theme={theme} />

          {/* Urban Landscape, Greens & Central Plazas */}
          <UrbanLandscapeFeatures theme={theme} />

          {/* Lush Perimeter Forest Framing the Tech Park */}
          <PerimeterForestMesh />

          {/* Road Network, Asphalt Lanes & Intersections */}
          {layerVisibility.infrastructure && (
            <RoadNetworkMesh
              intersections={roadIntersections}
              segments={roadSegments}
            />
          )}

          {/* Procedural Buildings with Smart City Cockpit Hologram & Facades */}
          {layerVisibility.standard && (
            <group>
              {buildings.map(building => (
                <BuildingMesh key={building.id} building={building} />
              ))}
            </group>
          )}

          {/* Telemetry Sensor Node Layer */}
          {layerVisibility.sensors && (
            <SensorMarkerMesh sensors={sensors} />
          )}

          {/* Hazard Heatmap & Overlays */}
          {layerVisibility.hazards && (
            <HazardOverlayMesh />
          )}

          {/* Active Navigation Route */}
          {layerVisibility.routes && (
            <RouteMesh />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
