import { StatKey } from '../../lib/character';

export type Species = {
  id: string;
  name: string;
  description: string;
  statModifiers: Partial<Record<StatKey, number>>;
};

export const speciesList: Species[] = [
  {
    id: 'human',
    name: 'Human',
    description: 'Versatile and endlessly adaptable. Humans spread through the stars on grit alone.',
    statModifiers: {},
  },
  {
    id: 'vantari',
    name: 'Vantari',
    description: 'A slender, keen-minded people known for sharp instincts and sharper trades.',
    statModifiers: { intellect: 2, strength: -1 },
  },
  {
    id: 'korrath',
    name: 'Korrath',
    description: 'Thick-hided and unshakeable, the Korrath thrive where others falter.',
    statModifiers: { strength: 2, charisma: -1 },
  },
  {
    id: 'synth',
    name: 'Synth',
    description: 'Once built to serve, the Synth now chart their own course among the stars.',
    statModifiers: { agility: 2, charisma: -1 },
  },
];

export function getSpecies(id: string): Species | undefined {
  return speciesList.find((species) => species.id === id);
}
