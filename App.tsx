import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WorldMapScreen } from './src/screens/WorldMapScreen';
import { SettlementScreen } from './src/screens/SettlementScreen';
import { loadSaveGame, writeSaveGame, SaveGame } from './src/lib/saveGame';
import { getSettlementForWorld } from './src/data/settlements';

type Screen = 'title' | 'settings' | 'map' | 'settlement';

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [activeSave, setActiveSave] = useState<SaveGame | null>(null);

  const goToTitle = useCallback(() => setScreen('title'), []);

  const handleContinue = useCallback(async () => {
    const save = await loadSaveGame();
    if (save) {
      setActiveSave(save);
      setScreen('settlement');
    }
  }, []);

  const handleStartNewGame = useCallback(async () => {
    const save = await loadSaveGame();
    setActiveSave(save);
    setScreen('settlement');
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

  const handleEnterWorld = useCallback((worldId: string) => {
    if (getSettlementForWorld(worldId)) {
      setScreen('settlement');
    } else {
      Alert.alert('Uncharted', 'This world has not been surveyed for exploration yet.');
    }
  }, []);

  const activeSettlement = activeSave ? getSettlementForWorld(activeSave.currentWorldId) : undefined;

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
      {screen === 'map' && activeSave && (
        <WorldMapScreen save={activeSave} onTravel={handleTravel} onEnterWorld={handleEnterWorld} onBackToTitle={goToTitle} />
      )}
      {screen === 'settlement' && activeSave && activeSettlement && (
        <SettlementScreen
          save={activeSave}
          settlement={activeSettlement}
          onOpenStarMap={() => setScreen('map')}
          onBackToTitle={goToTitle}
        />
      )}
    </SafeAreaProvider>
  );
}
