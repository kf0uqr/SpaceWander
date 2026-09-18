import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WorldMapScreen } from './src/screens/WorldMapScreen';
import { SettlementScreen } from './src/screens/SettlementScreen';
import { CharacterCreationScreen } from './src/screens/CharacterCreationScreen';
import { loadSaveGame, writeSaveGame, SaveGame } from './src/lib/saveGame';
import { CharacterConfig } from './src/lib/character';
import { getSettlementForWorld } from './src/data/settlements';
import { startingWorldId } from './src/data/worlds';

type Screen = 'title' | 'settings' | 'map' | 'settlement' | 'characterCreation';

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

  const handleStartNewGame = useCallback(() => {
    setScreen('characterCreation');
  }, []);

  const handleCharacterCreated = useCallback((character: CharacterConfig) => {
    const now = Date.now();
    const save: SaveGame = {
      createdAt: now,
      updatedAt: now,
      character,
      currentWorldId: startingWorldId,
      visitedWorldIds: [startingWorldId],
      acceptedMissionIds: [],
    };
    writeSaveGame(save);
    setActiveSave(save);
    setScreen('settlement');
  }, []);

  const handleAcceptMission = useCallback((missionId: string) => {
    setActiveSave((current) => {
      if (!current || current.acceptedMissionIds.includes(missionId)) return current;
      const next: SaveGame = {
        ...current,
        acceptedMissionIds: [...current.acceptedMissionIds, missionId],
        updatedAt: Date.now(),
      };
      writeSaveGame(next);
      return next;
    });
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
      {screen === 'characterCreation' && (
        <CharacterCreationScreen onCancel={goToTitle} onComplete={handleCharacterCreated} />
      )}
      {screen === 'map' && activeSave && (
        <WorldMapScreen save={activeSave} onTravel={handleTravel} onEnterWorld={handleEnterWorld} onBackToTitle={goToTitle} />
      )}
      {screen === 'settlement' && activeSave && activeSettlement && (
        <SettlementScreen
          save={activeSave}
          settlement={activeSettlement}
          onOpenStarMap={() => setScreen('map')}
          onBackToTitle={goToTitle}
          onAcceptMission={handleAcceptMission}
        />
      )}
    </SafeAreaProvider>
  );
}
