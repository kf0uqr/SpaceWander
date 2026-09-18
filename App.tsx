import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TitleScreen } from './src/screens/TitleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GameScreen } from './src/screens/GameScreen';
import { loadSaveGame, SaveGame } from './src/lib/saveGame';

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
      {screen === 'game' && activeSave && <GameScreen save={activeSave} onExit={goToTitle} />}
    </SafeAreaProvider>
  );
}
