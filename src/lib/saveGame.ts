import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterConfig, defaultCharacter } from './character';

const SAVE_KEY = 'spacewander.save.v1';

export type SaveGame = {
  createdAt: number;
  updatedAt: number;
  character: CharacterConfig;
  currentWorldId: string;
  visitedWorldIds: string[];
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
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SaveGame>;
    return {
      createdAt: parsed.createdAt ?? Date.now(),
      updatedAt: parsed.updatedAt ?? Date.now(),
      character: parsed.character ?? { ...defaultCharacter(), name: 'Captain' },
      currentWorldId: parsed.currentWorldId ?? '',
      visitedWorldIds: parsed.visitedWorldIds ?? (parsed.currentWorldId ? [parsed.currentWorldId] : []),
    };
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
