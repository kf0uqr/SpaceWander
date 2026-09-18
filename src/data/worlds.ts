export type World = {
  id: string;
  name: string;
  description: string;
  /** Normalized position on the map canvas, 0-1 in each axis. */
  x: number;
  y: number;
  /** ids of worlds directly reachable from this one. */
  connections: string[];
};

export const worlds: World[] = [
  {
    id: 'sol-outpost',
    name: 'Sol Outpost',
    description: 'A weathered trading station orbiting a dying star. Your journey begins here.',
    x: 0.2,
    y: 0.82,
    connections: ['verdant-reach'],
  },
  {
    id: 'verdant-reach',
    name: 'Verdant Reach',
    description: 'A lush jungle moon rich with rare flora for crafting components.',
    x: 0.42,
    y: 0.6,
    connections: ['sol-outpost', 'ashfall-belt', 'crystal-hollow'],
  },
  {
    id: 'ashfall-belt',
    name: 'Ashfall Belt',
    description: 'A scorched asteroid field where scavengers trade salvaged tech.',
    x: 0.22,
    y: 0.38,
    connections: ['verdant-reach', 'nebula-drift'],
  },
  {
    id: 'crystal-hollow',
    name: 'Crystal Hollow',
    description: 'Caverns of luminous crystal, prized by miners and enchanters alike.',
    x: 0.68,
    y: 0.42,
    connections: ['verdant-reach', 'nebula-drift', 'wraith-station'],
  },
  {
    id: 'nebula-drift',
    name: 'Nebula Drift',
    description: 'A colorful cloud of ionized gas hiding ancient derelict ships.',
    x: 0.42,
    y: 0.18,
    connections: ['ashfall-belt', 'crystal-hollow'],
  },
  {
    id: 'wraith-station',
    name: 'Wraith Station',
    description: 'An abandoned research station rumored to hold forgotten technology.',
    x: 0.85,
    y: 0.2,
    connections: ['crystal-hollow'],
  },
];

export function getWorld(id: string): World | undefined {
  return worlds.find((world) => world.id === id);
}

export const startingWorldId = 'sol-outpost';
