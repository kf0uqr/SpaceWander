import { CharacterStats } from './character';

export type Combatant = {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  minDamage: number;
  maxDamage: number;
};

export function rollDamage(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function playerMaxHp(stats: CharacterStats): number {
  return 20 + stats.strength * 2;
}

export function playerHitChance(stats: CharacterStats): number {
  return Math.min(0.95, Math.max(0.5, 0.7 + stats.agility * 0.02));
}

export const ENEMY_HIT_CHANCE = 0.75;

export type CombatLogEntry = {
  id: number;
  text: string;
};
