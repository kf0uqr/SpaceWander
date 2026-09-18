import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WorldMapScreen } from './src/screens/WorldMapScreen';
import { loadSaveGame, writeSaveGame, SaveGame } from './src/lib/saveGame';

type Screen = 'title' | 'settings' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [activeSave, setActiveSave] = useState<SaveGame | null>(null);

  const goToTitle = useCallback(() => setScreen('title'), []);

  const handleContinue = useCallback(async () => {
    const save = await loadSaveGame();
    if (save) {
      setActiveSave(save);
      setScreen('game');
    }
  }, []);

  const handleStartNewGame = useCallback(async () => {
    const save = await loadSaveGame();
    setActiveSave(save);
    setScreen('game');
  }, []);

  const handleTravel = useCallback((worldId: string) => {
    setActiveSave((current) => {
      if (!current || current.currentWorldId === worldId) return current;
      const next: SaveGame = {
        ...current,
        currentWorldId: worldId,
        visitedWorldIds: current.visitedWorldIds.includes(worldId)
          ? current.visitedWorldIds
          : [...current.visitedWorldIds, worldId],
        updatedAt: Date.now(),
      };
      writeSaveGame(next);
      return next;
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen === 'title' && (
        <TitleScreen
          onStartNewGame={handleStartNewGame}
          onContinue={handleContinue}
          onOpenSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'settings' && <SettingsScreen onBack={goToTitle} />}
      {screen === 'game' && activeSave && (
        <WorldMapScreen save={activeSave} onTravel={handleTravel} onBackToTitle={goToTitle} />
      )}
    </SafeAreaProvider>
  );
}
