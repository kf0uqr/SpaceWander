import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVE_KEY = 'spacewander.save.v1';

export type SaveGame = {
  createdAt: number;
  updatedAt: number;
  playerName: string;
  currentWorldId: string;
};

export async function hasSaveGame(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw !== null;
  } catch {
    return false;
  }
}

export async function loadSaveGame(): Promise<SaveGame | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveGame) : null;
  } catch {
    return null;
  }
}

export async function writeSaveGame(save: SaveGame): Promise<void> {
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export async function clearSaveGame(): Promise<void> {
  await AsyncStorage.removeItem(SAVE_KEY);
}
