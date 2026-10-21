import { RoadIntersection } from '../../types/routing';

export function findNearestRoadNode(
  pos: [number, number, number],
  nodes: RoadIntersection[]
): string {
  let minDistance = Infinity;
  let nearestId = nodes[0]?.id || 'node-c-0';

  const [x, , z] = pos;

  nodes.forEach(node => {
    const dx = x - node.position[0];
    const dz = z - node.position[1];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < minDistance) {
      minDistance = dist;
      nearestId = node.id;
    }
  });

  return nearestId;
}
