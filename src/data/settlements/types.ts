export type BuildingKind = 'spaceport' | 'hall' | 'shop' | 'house' | 'exit';

export type SettlementBuilding = {
  id: string;
  name: string;
  kind: BuildingKind;
  /** World-space footprint, top-left origin. Solid buildings block movement. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Flavor text or system response shown when the player interacts. */
  message: string;
  solid?: boolean;
};

export type Settlement = {
  worldId: string;
  name: string;
  mapWidth: number;
  mapHeight: number;
  playerSpawn: { x: number; y: number };
  buildings: SettlementBuilding[];
};
