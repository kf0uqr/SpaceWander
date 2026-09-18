import { getWorld, startingWorldId, World } from '../data/worlds';

export type WorldStatus = 'current' | 'unlocked' | 'locked';

export function getWorldStatus(
  world: World,
  currentWorldId: string,
  visitedWorldIds: string[],
): WorldStatus {
  if (world.id === currentWorldId) return 'current';
  if (world.id === startingWorldId) return 'unlocked';
  const isVisited = visitedWorldIds.includes(world.id);
  const isReachable = visitedWorldIds.some((visitedId) => {
    const visited = getWorld(visitedId);
    return visited?.connections.includes(world.id) ?? false;
  });
  return isVisited || isReachable ? 'unlocked' : 'locked';
}
