import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WorldMapScreen } from './src/screens/WorldMapScreen';
import { SettlementScreen } from './src/screens/SettlementScreen';
import { CharacterCreationScreen } from './src/screens/CharacterCreationScreen';
import { CombatScreen } from './src/screens/CombatScreen';
import { loadSaveGame, writeSaveGame, SaveGame } from './src/lib/saveGame';
import { CharacterConfig } from './src/lib/character';
import { getSettlementForWorld } from './src/data/settlements';
import { startingWorldId } from './src/data/worlds';
import { getMission } from './src/data/missions';

type Screen = 'title' | 'settings' | 'map' | 'settlement' | 'characterCreation' | 'combat';

type ActiveCombat = {
  missionId: string;
  weaponId: string;
  enemyId: string;
  enemyCount: number;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [activeSave, setActiveSave] = useState<SaveGame | null>(null);
  const [activeCombat, setActiveCombat] = useState<ActiveCombat | null>(null);

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
      completedMissionIds: [],
      inventory: [],
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

  const handleStartCombat = useCallback((missionId: string, grantWeapon: boolean) => {
    const mission = getMission(missionId);
    if (!mission?.combatIntro) return;
    const { weaponId, enemyId, enemyCount } = mission.combatIntro;

    if (grantWeapon) {
      setActiveSave((current) => {
        if (!current || current.inventory.includes(weaponId)) return current;
        const next: SaveGame = {
          ...current,
          inventory: [...current.inventory, weaponId],
          updatedAt: Date.now(),
        };
        writeSaveGame(next);
        return next;
      });
    }

    setActiveCombat({ missionId, weaponId, enemyId, enemyCount });
    setScreen('combat');
  }, []);

  const handleCombatVictory = useCallback(() => {
    const missionId = activeCombat?.missionId;
    setActiveCombat(null);
    setScreen('settlement');
    if (!missionId) return;
    setActiveSave((current) => {
      if (!current || current.completedMissionIds.includes(missionId)) return current;
      const next: SaveGame = {
        ...current,
        completedMissionIds: [...current.completedMissionIds, missionId],
        updatedAt: Date.now(),
      };
      writeSaveGame(next);
      return next;
    });
  }, [activeCombat]);

  const handleCombatExit = useCallback(() => {
    setActiveCombat(null);
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
          onStartCombat={handleStartCombat}
        />
      )}
      {screen === 'combat' && activeSave && activeCombat && (
        <CombatScreen
          character={activeSave.character}
          weaponId={activeCombat.weaponId}
          enemyId={activeCombat.enemyId}
          enemyCount={activeCombat.enemyCount}
          onVictory={handleCombatVictory}
          onExit={handleCombatExit}
        />
      )}
    </SafeAreaProvider>
  );
}
