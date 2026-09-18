export type CharacterSex = 'male' | 'female' | 'nonbinary';

export const SEX_OPTIONS: { id: CharacterSex; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'nonbinary', label: 'Non-binary' },
];

export const STAT_KEYS = ['strength', 'agility', 'intellect', 'charisma'] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type CharacterStats = Record<StatKey, number>;

export const STAT_LABELS: Record<StatKey, string> = {
  strength: 'Strength',
  agility: 'Agility',
  intellect: 'Intellect',
  charisma: 'Charisma',
};

export const STAT_POINT_POOL = 24;
export const STAT_MIN = 1;
export const STAT_MAX = 10;

export function defaultStats(): CharacterStats {
  const base = STAT_POINT_POOL / STAT_KEYS.length;
  return { strength: base, agility: base, intellect: base, charisma: base };
}

export function statPointsUsed(stats: CharacterStats): number {
  return STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
}

export type CharacterConfig = {
  name: string;
  sex: CharacterSex;
  speciesId: string;
  appearanceId: string;
  jobId: string;
  stats: CharacterStats;
};

export function defaultCharacter(): CharacterConfig {
  return {
    name: '',
    sex: 'male',
    speciesId: 'human',
    appearanceId: 'sandstone',
    jobId: 'pilot',
    stats: defaultStats(),
  };
}
