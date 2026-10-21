import { DistrictId } from './city';

export interface RoadIntersection {
  id: string;
  name: string;
  district: DistrictId;
  position: [number, number]; // [x, z] coordinate on ground
  isKeyDepot?: boolean; // Emergency staging point / Hospital / Fire HQ
}

export interface RoadSegment {
  id: string;
  fromNode: string;
  toNode: string;
  distance: number; // simulated meters
  district: DistrictId;
  lanes: number;
  status: 'clear' | 'slow' | 'flooded' | 'blocked';
  hazardSeverity: number; // 0 to 1
  baseSpeedKmH: number;
}

export interface RoutePlan {
  originNodeId: string;
  destinationNodeId: string;
  pathNodes: string[];
  pathSegments: string[];
  totalDistanceMeters: number;
  simulatedTravelMinutes: number;
  status: 'optimal' | 'rerouted_hazard' | 'impassable';
  notes: string;
  waypoints: [number, number, number][]; // 3D coordinates for visual rendering
}
