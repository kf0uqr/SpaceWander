export type EnemyTemplate = {
  id: string;
  name: string;
  maxHp: number;
  minDamage: number;
  maxDamage: number;
};

export const enemyTemplates: EnemyTemplate[] = [
  {
    id: 'sand-lurker',
    name: 'Sand-lurker',
    maxHp: 14,
    minDamage: 1,
    maxDamage: 4,
  },
];

export function getEnemyTemplate(id: string): EnemyTemplate | undefined {
  return enemyTemplates.find((enemy) => enemy.id === id);
}
