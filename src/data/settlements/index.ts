import { Settlement } from './types';
import { solOutpostSettlement } from './solOutpost';

const settlementsByWorldId: Record<string, Settlement> = {
  [solOutpostSettlement.worldId]: solOutpostSettlement,
};

export function getSettlementForWorld(worldId: string): Settlement | undefined {
  return settlementsByWorldId[worldId];
}

export * from './types';
