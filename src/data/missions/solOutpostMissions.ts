import { Mission } from './types';

export const solOutpostMissions: Mission[] = [
  {
    id: 'pest-problem',
    worldId: 'sol-outpost',
    title: 'Pest Problem',
    summary: "A settler's cottage is overrun with vermin.",
    description:
      "Old Toma's cottage has been crawling with sand-lurkers for days, and she's too afraid to go back inside. " +
      'Clear the infestation out of Settler Cottage and she might finally get some sleep.',
    giverName: 'Old Toma',
    giverLocation: 'Cantina',
    reward: '50 credits',
  },
];
