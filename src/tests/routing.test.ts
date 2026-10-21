import { describe, it, expect } from 'vitest';
import { ROAD_INTERSECTIONS, ROAD_SEGMENTS } from '../data/roadGraph';
import { computeShortestRoute } from '../simulation/routing/dijkstra';

describe('Dijkstra Response Routing Engine', () => {
  it('should find optimal route between Spire Center and Hospital Trauma Center', () => {
    const route = computeShortestRoute('node-c-0', 'node-t-0', ROAD_INTERSECTIONS, ROAD_SEGMENTS);

    expect(route).toBeDefined();
    expect(route.status).toBe('optimal');
    expect(route.pathNodes[0]).toBe('node-c-0');
    expect(route.pathNodes[route.pathNodes.length - 1]).toBe('node-t-0');
    expect(route.totalDistanceMeters).toBeGreaterThan(0);
    expect(route.simulatedTravelMinutes).toBeGreaterThan(0);
    expect(route.waypoints.length).toBe(route.pathNodes.length);
  });

  it('should handle identical origin and destination', () => {
    const route = computeShortestRoute('node-c-0', 'node-c-0', ROAD_INTERSECTIONS, ROAD_SEGMENTS);

    expect(route.status).toBe('optimal');
    expect(route.totalDistanceMeters).toBe(0);
    expect(route.pathNodes).toEqual(['node-c-0']);
  });

  it('should re-route around blocked or hazardous road segments', () => {
    // Simulate road blockage on direct corridor
    const modifiedRoads = ROAD_SEGMENTS.map(r => {
      if (r.id === 'seg-ct-01' || r.id === 'seg-t-01') {
        return { ...r, status: 'blocked' as const, hazardSeverity: 0.9 };
      }
      return r;
    });

    const route = computeShortestRoute('node-c-0', 'node-t-0', ROAD_INTERSECTIONS, modifiedRoads);

    expect(route).toBeDefined();
    // Route must not contain the blocked segments
    expect(route.pathSegments).not.toContain('seg-ct-01');
    expect(route.pathSegments).not.toContain('seg-t-01');
    expect(route.status).toBe('rerouted_hazard');
  });

  it('should handle invalid node IDs gracefully', () => {
    const route = computeShortestRoute('invalid-node-1', 'node-c-0', ROAD_INTERSECTIONS, ROAD_SEGMENTS);
    expect(route.status).toBe('impassable');
    expect(route.pathNodes.length).toBe(0);
  });
});
