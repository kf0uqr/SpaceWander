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
    combatIntro: {
      dialogue: [
        "The cantina owner, Gus, wipes down the bar and nods toward Old Toma's corner. \"She's not wrong about the noise. I've heard it myself.\"",
        '"Sand-lurkers, by the sound of it. Nasty little things, but nothing a steady shot can\'t handle."',
        'He reaches under the bar and sets a battered pistol on the counter.',
        '"This old blaster\'s seen better days, but it still shoots true. Take it - clear out her cottage, and it\'s yours to keep."',
      ],
      weaponId: 'old-blaster-pistol',
      enemyId: 'sand-lurker',
      enemyCount: 3,
    },
  },
];
