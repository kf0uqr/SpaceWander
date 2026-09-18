import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { Starfield } from '../components/Starfield';
import { colors } from '../theme/colors';
import { SaveGame } from '../lib/saveGame';

export function GameScreen({ save, onExit }: { save: SaveGame; onExit: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <Starfield density={80} />
      <Text style={styles.title}>Welcome, {save.playerName}</Text>
      <Text style={styles.subtitle}>Current world: {save.currentWorldId}</Text>
      <Text style={styles.body}>
        World exploration, crafting, and trading are still under construction. Check back soon,
        Captain.
      </Text>
      <View style={styles.footer}>
        <MenuButton label="Back to Title" onPress={onExit} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.accent,
    fontSize: 16,
    marginBottom: 24,
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 48,
  },
});
