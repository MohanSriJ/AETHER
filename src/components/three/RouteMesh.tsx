import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '../../store/simulationStore';

export const RouteMesh: React.FC = () => {
  const activeRoute = useSimulationStore(state => state.activeRoute);

  const isRerouted = activeRoute?.status === 'rerouted_hazard';
  const routeColor = isRerouted ? '#ffbf69' : '#54e7f2';

  const { points, lineObject } = useMemo(() => {
    if (!activeRoute || activeRoute.waypoints.length < 2) {
      return { points: [], lineObject: null };
    }

    const vectors = activeRoute.waypoints.map(wp => new THREE.Vector3(wp[0], wp[1] + 0.3, wp[2]));
    const curve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.1);
    const pts = curve.getPoints(Math.max(20, vectors.length * 8));
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: routeColor, linewidth: 3 });
    const line = new THREE.Line(geom, mat);

    return { points: vectors, lineObject: line };
  }, [activeRoute, routeColor]);

  if (!activeRoute || !lineObject) return null;

  return (
    <group>
      {/* 3D Illuminated Route Line */}
      <primitive object={lineObject} />

      {/* Origin Marker */}
      {points[0] && (
        <mesh position={[points[0].x, points[0].y + 0.5, points[0].z]}>
          <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
          <meshStandardMaterial color="#42d6a4" emissive="#42d6a4" emissiveIntensity={1.5} />
        </mesh>
      )}

      {/* Destination Marker */}
      {points[points.length - 1] && (
        <mesh position={[points[points.length - 1].x, points[points.length - 1].y + 0.5, points[points.length - 1].z]}>
          <cylinderGeometry args={[0.7, 0.7, 0.5, 16]} />
          <meshStandardMaterial color="#ff647c" emissive="#ff647c" emissiveIntensity={1.5} />
        </mesh>
      )}

      {/* Intermediate waypoint nodes */}
      {points.slice(1, -1).map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color={routeColor} emissive={routeColor} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
};
