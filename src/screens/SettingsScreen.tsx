import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { Starfield } from '../components/Starfield';
import { colors } from '../theme/colors';
import { defaultSettings, GameSettings, loadSettings, writeSettings } from '../lib/settings';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  function update(partial: Partial<GameSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    writeSettings(next);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Starfield density={60} />
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Music</Text>
        <Switch
          value={settings.musicEnabled}
          onValueChange={(value) => update({ musicEnabled: value })}
          disabled={!loaded}
          trackColor={{ true: colors.accent, false: colors.buttonDisabled }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Sound Effects</Text>
        <Switch
          value={settings.soundEnabled}
          onValueChange={(value) => update({ soundEnabled: value })}
          disabled={!loaded}
          trackColor={{ true: colors.accent, false: colors.buttonDisabled }}
        />
      </View>

      <View style={styles.footer}>
        <MenuButton label="Back" onPress={onBack} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 32,
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textMuted,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: 17,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 24,
  },
});
