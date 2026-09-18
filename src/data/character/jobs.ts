export type Job = {
  id: string;
  name: string;
  description: string;
};

export const jobsList: Job[] = [
  {
    id: 'pilot',
    name: 'Pilot',
    description: 'Skilled at the stick. Ships answer to your hand.',
  },
  {
    id: 'engineer',
    name: 'Engineer',
    description: 'You keep the lights on and the engines running.',
  },
  {
    id: 'trader',
    name: 'Trader',
    description: "You know the value of everything, and the price of nothing you don't have to pay.",
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    description: 'Blaster first, questions later.',
  },
  {
    id: 'scavenger',
    name: 'Scavenger',
    description: "One being's wreckage is your fortune.",
  },
];

export function getJob(id: string): Job | undefined {
  return jobsList.find((job) => job.id === id);
}
