export type AppearanceOption = {
  id: string;
  label: string;
  color: string;
};

export const appearanceOptions: AppearanceOption[] = [
  { id: 'sandstone', label: 'Sandstone', color: '#e3b98f' },
  { id: 'amber', label: 'Amber', color: '#e0973c' },
  { id: 'verdant', label: 'Verdant', color: '#6fae6a' },
  { id: 'slate', label: 'Slate', color: '#8b93a6' },
  { id: 'crimson', label: 'Crimson', color: '#c8555a' },
  { id: 'azure', label: 'Azure', color: '#5a9fd4' },
  { id: 'violet', label: 'Violet', color: '#9b6fc9' },
  { id: 'bone', label: 'Bone', color: '#e8e2d0' },
];

export function getAppearance(id: string): AppearanceOption | undefined {
  return appearanceOptions.find((option) => option.id === id);
}
