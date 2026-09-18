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
};
