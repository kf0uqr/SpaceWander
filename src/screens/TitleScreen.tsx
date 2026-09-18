import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { Starfield } from '../components/Starfield';
import { colors } from '../theme/colors';
import { hasSaveGame, writeSaveGame } from '../lib/saveGame';
import { startingWorldId } from '../data/worlds';

type TitleScreenProps = {
  onStartNewGame: () => void;
  onContinue: () => void;
  onOpenSettings: () => void;
};

export function TitleScreen({ onStartNewGame, onContinue, onOpenSettings }: TitleScreenProps) {
  const [checkingSave, setCheckingSave] = useState(true);
  const [saveExists, setSaveExists] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hasSaveGame().then((exists) => {
      if (!cancelled) {
        setSaveExists(exists);
        setCheckingSave(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleStart() {
    if (saveExists) {
      Alert.alert(
        'Start New Voyage',
        'This will overwrite your existing save. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Start New Game', style: 'destructive', onPress: () => beginNewGame() },
        ],
      );
    } else {
      beginNewGame();
    }
  }

  function beginNewGame() {
    const now = Date.now();
    writeSaveGame({
      createdAt: now,
      updatedAt: now,
      playerName: 'Captain',
      currentWorldId: startingWorldId,
      visitedWorldIds: [startingWorldId],
    }).then(() => {
      setSaveExists(true);
      onStartNewGame();
    });
  }

  function handleExit() {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert('Exit', 'iOS apps close by pressing the Home button or swiping up.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Starfield density={140} />

      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>A Galaxy Awaits</Text>
        <Text style={styles.title}>Space Wander</Text>
      </View>

      <View style={styles.menu}>
        {checkingSave ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <>
            <MenuButton label="Start" onPress={handleStart} />
            <MenuButton label="Continue" onPress={onContinue} disabled={!saveExists} />
            <MenuButton label="Settings" onPress={onOpenSettings} variant="secondary" />
            <MenuButton label="Exit" onPress={handleExit} variant="secondary" />
          </>
        )}
      </View>

      <Text style={styles.version}>v0.1.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  titleBlock: {
    marginTop: 96,
    alignItems: 'center',
  },
  eyebrow: {
    color: colors.accentWarm,
    fontSize: 13,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  menu: {
    gap: 14,
    marginBottom: 64,
  },
  loader: {
    marginVertical: 24,
  },
  version: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    color: colors.textMuted,
    fontSize: 11,
  },
});
