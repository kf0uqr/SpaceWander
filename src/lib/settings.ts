import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'spacewander.settings.v1';

export type GameSettings = {
  musicEnabled: boolean;
  soundEnabled: boolean;
};

export const defaultSettings: GameSettings = {
  musicEnabled: true,
  soundEnabled: true,
};

export async function loadSettings(): Promise<GameSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function writeSettings(settings: GameSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
