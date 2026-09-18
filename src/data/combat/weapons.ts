export type Weapon = {
  id: string;
  name: string;
  description: string;
  minDamage: number;
  maxDamage: number;
};

export const weapons: Weapon[] = [
  {
    id: 'old-blaster-pistol',
    name: 'Old Blaster Pistol',
    description: "A battered sidearm that's seen better days, but it still shoots true.",
    minDamage: 4,
    maxDamage: 9,
  },
];

export function getWeapon(id: string): Weapon | undefined {
  return weapons.find((weapon) => weapon.id === id);
}
