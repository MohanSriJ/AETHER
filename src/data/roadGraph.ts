import { RoadIntersection, RoadSegment } from '../types/routing';

export const ROAD_INTERSECTIONS: RoadIntersection[] = [
  // Central District Intersections
  { id: 'node-c-0', name: 'Grand Central Plaza (Spire Base)', district: 'central', position: [0, 0], isKeyDepot: true },
  { id: 'node-c-1', name: 'North Central Blvd & 1st Ave', district: 'central', position: [0, 15] },
  { id: 'node-c-2', name: 'South Central Gate', district: 'central', position: [0, -15] },
  { id: 'node-c-3', name: 'East Financial Crossing', district: 'central', position: [20, 0] },
  { id: 'node-c-4', name: 'West Transit Exchange', district: 'central', position: [-20, 0] },
  { id: 'node-c-5', name: 'Northeast Avenue', district: 'central', position: [18, 15] },
  { id: 'node-c-6', name: 'Northwest Transit Hub', district: 'central', position: [-18, 15] },

  // Waterfront District Intersections (South)
  { id: 'node-w-0', name: 'Bifrost Bridge North Anchor', district: 'waterfront', position: [0, -25] },
  { id: 'node-w-1', name: 'Bifrost Bridge South Landing', district: 'waterfront', position: [0, -40] },
  { id: 'node-w-2', name: 'Promenade Quay West', district: 'waterfront', position: [-25, -45] },
  { id: 'node-w-3', name: 'Marina Basin Wharf', district: 'waterfront', position: [-45, -45] },
  { id: 'node-w-4', name: 'Canal Pump Station Depot', district: 'waterfront', position: [-15, -55], isKeyDepot: true },
  { id: 'node-w-5', name: 'East Marina Docks', district: 'waterfront', position: [18, -45] },

  // Industrial District Intersections (East)
  { id: 'node-i-0', name: 'Industrial Gateway Junction', district: 'industrial', position: [35, 0] },
  { id: 'node-i-1', name: 'Substation Alpha Gate', district: 'industrial', position: [50, -15], isKeyDepot: true },
  { id: 'node-i-2', name: 'Battery Array Access Road', district: 'industrial', position: [65, 0] },
  { id: 'node-i-3', name: 'Logistics Fulfillment Junction', district: 'industrial', position: [55, 20] },
  { id: 'node-i-4', name: 'Fabrication Lane North', district: 'industrial', position: [38, 20] },

  // Tech & Medical Quadrant Intersections (Northwest)
  { id: 'node-t-0', name: 'Medical Center Emergency Bay', district: 'tech_quad', position: [-30, 30], isKeyDepot: true },
  { id: 'node-t-1', name: 'Quantum Campus Entrance', district: 'tech_quad', position: [-48, 20] },
  { id: 'node-t-2', name: 'Bio-Genetics Ring Road', district: 'tech_quad', position: [-40, 50] },
  { id: 'node-t-3', name: 'Autonomous Systems Blvd', district: 'tech_quad', position: [-20, 45] },
  { id: 'node-t-4', name: 'Tech Parkway Crossing', district: 'tech_quad', position: [-10, 30] }
];

export const ROAD_SEGMENTS: RoadSegment[] = [
  // Central Grid Connections
  { id: 'seg-c-01', fromNode: 'node-c-0', toNode: 'node-c-1', distance: 150, district: 'central', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-c-02', fromNode: 'node-c-0', toNode: 'node-c-2', distance: 150, district: 'central', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-c-03', fromNode: 'node-c-0', toNode: 'node-c-3', distance: 200, district: 'central', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-c-04', fromNode: 'node-c-0', toNode: 'node-c-4', distance: 200, district: 'central', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-c-05', fromNode: 'node-c-1', toNode: 'node-c-5', distance: 180, district: 'central', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-c-06', fromNode: 'node-c-3', toNode: 'node-c-5', distance: 150, district: 'central', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-c-07', fromNode: 'node-c-1', toNode: 'node-c-6', distance: 180, district: 'central', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-c-08', fromNode: 'node-c-4', toNode: 'node-c-6', distance: 150, district: 'central', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },

  // Central to Waterfront Bridge corridor
  { id: 'seg-cw-01', fromNode: 'node-c-2', toNode: 'node-w-0', distance: 120, district: 'central', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-cw-02', fromNode: 'node-w-0', toNode: 'node-w-1', distance: 160, district: 'waterfront', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 60 },
  
  // Waterfront Arteries
  { id: 'seg-w-01', fromNode: 'node-w-1', toNode: 'node-w-2', distance: 260, district: 'waterfront', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-w-02', fromNode: 'node-w-2', toNode: 'node-w-3', distance: 200, district: 'waterfront', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 40 },
  { id: 'seg-w-03', fromNode: 'node-w-2', toNode: 'node-w-4', distance: 150, district: 'waterfront', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 35 },
  { id: 'seg-w-04', fromNode: 'node-w-1', toNode: 'node-w-5', distance: 190, district: 'waterfront', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 40 },
  { id: 'seg-w-05', fromNode: 'node-c-4', toNode: 'node-w-2', distance: 450, district: 'waterfront', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },

  // Central to Industrial Corridor
  { id: 'seg-ci-01', fromNode: 'node-c-3', toNode: 'node-i-0', distance: 160, district: 'industrial', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 60 },
  { id: 'seg-i-01', fromNode: 'node-i-0', toNode: 'node-i-1', distance: 210, district: 'industrial', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-i-02', fromNode: 'node-i-0', toNode: 'node-i-2', distance: 300, district: 'industrial', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-i-03', fromNode: 'node-i-2', toNode: 'node-i-3', distance: 220, district: 'industrial', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-i-04', fromNode: 'node-i-3', toNode: 'node-i-4', distance: 170, district: 'industrial', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 40 },
  { id: 'seg-i-05', fromNode: 'node-i-4', toNode: 'node-c-5', distance: 210, district: 'industrial', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },

  // Central to Tech & Medical Quadrant
  { id: 'seg-ct-01', fromNode: 'node-c-6', toNode: 'node-t-4', distance: 170, district: 'tech_quad', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-t-01', fromNode: 'node-t-4', toNode: 'node-t-0', distance: 200, district: 'tech_quad', lanes: 4, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 },
  { id: 'seg-t-02', fromNode: 'node-t-0', toNode: 'node-t-1', distance: 210, district: 'tech_quad', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-t-03', fromNode: 'node-t-0', toNode: 'node-t-3', distance: 180, district: 'tech_quad', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 45 },
  { id: 'seg-t-04', fromNode: 'node-t-3', toNode: 'node-t-2', distance: 210, district: 'tech_quad', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 40 },
  { id: 'seg-t-05', fromNode: 'node-t-1', toNode: 'node-t-2', distance: 310, district: 'tech_quad', lanes: 2, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 40 },
  { id: 'seg-t-06', fromNode: 'node-c-4', toNode: 'node-t-0', distance: 320, district: 'tech_quad', lanes: 3, status: 'clear', hazardSeverity: 0, baseSpeedKmH: 50 }
];
