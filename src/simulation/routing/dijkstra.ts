import { RoadIntersection, RoadSegment, RoutePlan } from '../../types/routing';

interface NodeCost {
  nodeId: string;
  cost: number;
  prevNodeId: string | null;
  viaSegmentId: string | null;
}

export function computeShortestRoute(
  originId: string,
  destinationId: string,
  nodes: RoadIntersection[],
  segments: RoadSegment[]
): RoutePlan {
  const nodeMap = new Map<string, RoadIntersection>(nodes.map(n => [n.id, n]));
  const originNode = nodeMap.get(originId);
  const destNode = nodeMap.get(destinationId);

  if (!originNode || !destNode) {
    return {
      originNodeId: originId,
      destinationNodeId: destinationId,
      pathNodes: [],
      pathSegments: [],
      totalDistanceMeters: 0,
      simulatedTravelMinutes: 0,
      status: 'impassable',
      notes: 'Invalid origin or destination node identifier.',
      waypoints: []
    };
  }

  if (originId === destinationId) {
    return {
      originNodeId: originId,
      destinationNodeId: destinationId,
      pathNodes: [originId],
      pathSegments: [],
      totalDistanceMeters: 0,
      simulatedTravelMinutes: 0,
      status: 'optimal',
      notes: 'Origin and destination are identical.',
      waypoints: [[originNode.position[0], 0.6, originNode.position[1]]]
    };
  }

  // Build adjacency list (bi-directional road network)
  const adj = new Map<string, { targetNode: string; segment: RoadSegment; effectiveWeight: number }[]>();
  nodes.forEach(n => adj.set(n.id, []));

  segments.forEach(seg => {
    // If flooded or blocked, set very high cost or exclude if impassable
    let weightMultiplier = 1.0;
    if (seg.status === 'blocked' || seg.hazardSeverity >= 0.8) {
      weightMultiplier = 999999; // Effectively impassable
    } else if (seg.status === 'flooded') {
      weightMultiplier = 8.0; // Severe slowdown
    } else if (seg.status === 'slow') {
      weightMultiplier = 2.5;
    }

    const weight = seg.distance * weightMultiplier;

    adj.get(seg.fromNode)?.push({ targetNode: seg.toNode, segment: seg, effectiveWeight: weight });
    adj.get(seg.toNode)?.push({ targetNode: seg.fromNode, segment: seg, effectiveWeight: weight });
  });

  // Dijkstra's algorithm
  const distances = new Map<string, NodeCost>();
  const unvisited = new Set<string>();

  nodes.forEach(n => {
    distances.set(n.id, {
      nodeId: n.id,
      cost: n.id === originId ? 0 : Infinity,
      prevNodeId: null,
      viaSegmentId: null
    });
    unvisited.add(n.id);
  });

  while (unvisited.size > 0) {
    // Find unvisited node with lowest cost
    let currentMinNode: string | null = null;
    let minCost = Infinity;

    unvisited.forEach(nodeId => {
      const nodeCost = distances.get(nodeId)!.cost;
      if (nodeCost < minCost) {
        minCost = nodeCost;
        currentMinNode = nodeId;
      }
    });

    if (!currentMinNode || minCost === Infinity) {
      break; // Remaining nodes unreachable
    }

    if (currentMinNode === destinationId) {
      break; // Found shortest path to destination
    }

    unvisited.delete(currentMinNode);

    const neighbors = adj.get(currentMinNode) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetNode)) continue;

      const altCost = minCost + neighbor.effectiveWeight;
      const currentNeighborCost = distances.get(neighbor.targetNode)!.cost;

      if (altCost < currentNeighborCost) {
        distances.set(neighbor.targetNode, {
          nodeId: neighbor.targetNode,
          cost: altCost,
          prevNodeId: currentMinNode,
          viaSegmentId: neighbor.segment.id
        });
      }
    }
  }

  // Reconstruct path
  const pathNodes: string[] = [];
  const pathSegments: string[] = [];
  let curr: string | null = destinationId;
  let encounteredHazard = false;

  while (curr !== null) {
    pathNodes.unshift(curr);
    const costInfo = distances.get(curr);
    if (!costInfo || (curr !== originId && costInfo.prevNodeId === null)) {
      // Unreachable
      return {
        originNodeId: originId,
        destinationNodeId: destinationId,
        pathNodes: [],
        pathSegments: [],
        totalDistanceMeters: 0,
        simulatedTravelMinutes: 0,
        status: 'impassable',
        notes: 'Target location is unreachable due to severe hazard blockages along all connecting arteries.',
        waypoints: []
      };
    }

    if (costInfo.viaSegmentId) {
      pathSegments.unshift(costInfo.viaSegmentId);
      const segObj = segments.find(s => s.id === costInfo.viaSegmentId);
      if (segObj && (segObj.hazardSeverity > 0.2 || segObj.status !== 'clear')) {
        encounteredHazard = true;
      }
    }

    curr = costInfo.prevNodeId;
  }

  // Calculate actual physical distance and travel time
  let totalDistanceMeters = 0;
  pathSegments.forEach(segId => {
    const seg = segments.find(s => s.id === segId);
    if (seg) totalDistanceMeters += seg.distance;
  });

  // Average 45 km/h base speed (~750 meters/minute)
  const simulatedTravelMinutes = Math.max(1.2, Number((totalDistanceMeters / 650).toFixed(1)));

  // Generate 3D waypoints for visualization
  const waypoints: [number, number, number][] = pathNodes.map(nodeId => {
    const node = nodeMap.get(nodeId)!;
    return [node.position[0], 0.8, node.position[1]];
  });

  const hasNetworkHazards = segments.some(s => s.status !== 'clear' || s.hazardSeverity > 0.3);
  const isRerouted = encounteredHazard || hasNetworkHazards;

  return {
    originNodeId: originId,
    destinationNodeId: destinationId,
    pathNodes,
    pathSegments,
    totalDistanceMeters,
    simulatedTravelMinutes,
    status: isRerouted ? 'rerouted_hazard' : 'optimal',
    notes: isRerouted
      ? 'Dijkstra route modified: active hazard zones avoided; routing via alternative cleared corridors.'
      : 'Primary direct corridor cleared; optimal priority emergency routing selected.',
    waypoints
  };
}
