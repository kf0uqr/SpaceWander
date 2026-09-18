export type Mission = {
  id: string;
  worldId: string;
  title: string;
  /** Short teaser shown on the board list. */
  summary: string;
  /** Full text shown once a post is opened. */
  description: string;
  /** Who posted it / who to talk to for more information. */
  giverName: string;
  /** Where that person can be found. */
  giverLocation: string;
  reward: string;
  /** The combat encounter this mission unlocks, reached by talking to the giver in person. */
  combatIntro?: {
    /** The giver's lines, shown one at a time before the fight. */
    dialogue: string[];
    weaponId: string;
    enemyId: string;
    enemyCount: number;
  };
};
