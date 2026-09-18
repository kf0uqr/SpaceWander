import { Mission } from './types';
import { solOutpostMissions } from './solOutpostMissions';

const allMissions: Mission[] = [...solOutpostMissions];

export function getMissionsForWorld(worldId: string): Mission[] {
  return allMissions.filter((mission) => mission.worldId === worldId);
}

export function getMission(id: string): Mission | undefined {
  return allMissions.find((mission) => mission.id === id);
}

export * from './types';
