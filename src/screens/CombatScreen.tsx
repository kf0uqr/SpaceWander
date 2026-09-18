import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { colors } from '../theme/colors';
import { getWeapon } from '../data/combat/weapons';
import { getEnemyTemplate } from '../data/combat/enemies';
import {
  Combatant,
  CombatLogEntry,
  ENEMY_HIT_CHANCE,
  playerHitChance,
  playerMaxHp,
  rollDamage,
} from '../lib/combat';
import { CharacterConfig } from '../lib/character';

type CombatScreenProps = {
  character: CharacterConfig;
  weaponId: string;
  enemyId: string;
  enemyCount: number;
  onVictory: () => void;
  onExit: () => void;
};

type Outcome = 'ongoing' | 'victory' | 'defeat';

function hpPercent(hp: number, maxHp: number): number {
  return Math.max(0, Math.min(100, (hp / maxHp) * 100));
}

export function CombatScreen({ character, weaponId, enemyId, enemyCount, onVictory, onExit }: CombatScreenProps) {
  const weapon = getWeapon(weaponId);
  const enemyTemplate = getEnemyTemplate(enemyId);
  const maxHp = useMemo(() => playerMaxHp(character.stats), [character.stats]);
  const hitChance = useMemo(() => playerHitChance(character.stats), [character.stats]);

  const [playerHp, setPlayerHp] = useState(maxHp);
  const [enemies, setEnemies] = useState<Combatant[]>(() =>
    Array.from({ length: enemyCount }, (_, index) => ({
      id: `${enemyId}-${index}`,
      name: `${enemyTemplate?.name ?? 'Vermin'} ${index + 1}`,
      hp: enemyTemplate?.maxHp ?? 10,
      maxHp: enemyTemplate?.maxHp ?? 10,
      minDamage: enemyTemplate?.minDamage ?? 1,
      maxDamage: enemyTemplate?.maxDamage ?? 3,
    })),
  );
  const [targetId, setTargetId] = useState<string | null>(enemies[0]?.id ?? null);
  const [log, setLog] = useState<CombatLogEntry[]>([
    { id: 0, text: `${enemyTemplate?.name ?? 'Vermin'} scurry out from the shadows!` },
  ]);
  const [outcome, setOutcome] = useState<Outcome>('ongoing');
  const logIdRef = useRef(1);

  useEffect(() => {
    const targetAlive = enemies.some((enemy) => enemy.id === targetId && enemy.hp > 0);
    if (!targetAlive) {
      setTargetId(enemies.find((enemy) => enemy.hp > 0)?.id ?? null);
    }
  }, [enemies, targetId]);

  function appendLog(entries: string[]) {
    setLog((current) => [
      ...entries.map((text) => ({ id: logIdRef.current++, text })).reverse(),
      ...current,
    ]);
  }

  function handleAttack() {
    if (outcome !== 'ongoing' || !weapon) return;
    const target = enemies.find((enemy) => enemy.id === targetId && enemy.hp > 0);
    if (!target) return;

    const newLines: string[] = [];
    let nextEnemies = enemies;

    if (Math.random() < hitChance) {
      const damage = rollDamage(weapon.minDamage, weapon.maxDamage);
      nextEnemies = enemies.map((enemy) =>
        enemy.id === target.id ? { ...enemy, hp: Math.max(0, enemy.hp - damage) } : enemy,
      );
      newLines.push(`You hit ${target.name} for ${damage} damage.`);
      const updated = nextEnemies.find((enemy) => enemy.id === target.id);
      if (updated && updated.hp <= 0) newLines.push(`${target.name} is defeated!`);
    } else {
      newLines.push(`You fire at ${target.name} and miss.`);
    }

    const anyAlive = nextEnemies.some((enemy) => enemy.hp > 0);
    if (!anyAlive) {
      setEnemies(nextEnemies);
      appendLog(newLines);
      setOutcome('victory');
      return;
    }

    let nextPlayerHp = playerHp;
    for (const enemy of nextEnemies) {
      if (enemy.hp <= 0) continue;
      if (Math.random() < ENEMY_HIT_CHANCE) {
        const damage = rollDamage(enemy.minDamage, enemy.maxDamage);
        nextPlayerHp = Math.max(0, nextPlayerHp - damage);
        newLines.push(`${enemy.name} bites you for ${damage} damage.`);
      } else {
        newLines.push(`${enemy.name} lunges at you and misses.`);
      }
      if (nextPlayerHp <= 0) break;
    }

    setEnemies(nextEnemies);
    setPlayerHp(nextPlayerHp);
    appendLog(newLines);
    if (nextPlayerHp <= 0) {
      setOutcome('defeat');
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>Settler Cottage</Text>
        <Text style={styles.headerTitle}>Clearing the Infestation</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.playerCard}>
          <Text style={styles.playerName}>{character.name}</Text>
          <View style={styles.hpBarTrack}>
            <View style={[styles.hpBarFill, { width: `${hpPercent(playerHp, maxHp)}%` }]} />
          </View>
          <Text style={styles.hpText}>
            HP {playerHp} / {maxHp}
          </Text>
          <Text style={styles.weaponText}>Wielding: {weapon?.name ?? 'Fists'}</Text>
        </View>

        <View style={styles.enemyList}>
          {enemies.map((enemy) => {
            const defeated = enemy.hp <= 0;
            const selected = enemy.id === targetId;
            return (
              <Pressable
                key={enemy.id}
                disabled={defeated}
                onPress={() => setTargetId(enemy.id)}
                style={[styles.enemyCard, selected && styles.enemyCardSelected, defeated && styles.enemyCardDefeated]}
              >
                <Text style={[styles.enemyName, defeated && styles.enemyNameDefeated]}>
                  {enemy.name} {defeated ? '(defeated)' : ''}
                </Text>
                {!defeated && (
                  <>
                    <View style={styles.hpBarTrack}>
                      <View style={[styles.hpBarFill, styles.enemyHpFill, { width: `${hpPercent(enemy.hp, enemy.maxHp)}%` }]} />
                    </View>
                    <Text style={styles.hpText}>
                      HP {enemy.hp} / {enemy.maxHp}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>

        <ScrollView style={styles.log} contentContainerStyle={styles.logContent}>
          {log.map((entry) => (
            <Text key={entry.id} style={styles.logLine}>
              {entry.text}
            </Text>
          ))}
        </ScrollView>
      </View>

      {outcome === 'ongoing' && (
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <MenuButton label="Flee" onPress={onExit} variant="secondary" />
          </View>
          <View style={styles.footerButton}>
            <MenuButton label="Attack" onPress={handleAttack} disabled={!targetId} />
          </View>
        </View>
      )}

      {outcome === 'victory' && (
        <View style={styles.outcomePanel}>
          <Text style={styles.outcomeTitle}>Infestation Cleared</Text>
          <Text style={styles.outcomeBody}>The last of the sand-lurkers falls still. Old Toma will finally sleep.</Text>
          <MenuButton label="Continue" onPress={onVictory} />
        </View>
      )}

      {outcome === 'defeat' && (
        <View style={styles.outcomePanel}>
          <Text style={styles.outcomeTitle}>You Black Out</Text>
          <Text style={styles.outcomeBody}>The wounds catch up with you. You wake up back at the cantina, wounds tended.</Text>
          <MenuButton label="Retreat" onPress={onExit} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerEyebrow: {
    color: colors.accentWarm,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  playerCard: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    padding: 14,
    backgroundColor: 'rgba(94, 231, 255, 0.06)',
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  weaponText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  enemyList: {
    gap: 10,
  },
  enemyCard: {
    borderWidth: 1,
    borderColor: colors.buttonDisabled,
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  enemyCardSelected: {
    borderColor: colors.accentWarm,
    backgroundColor: 'rgba(255, 180, 84, 0.1)',
  },
  enemyCardDefeated: {
    opacity: 0.4,
  },
  enemyName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  enemyNameDefeated: {
    color: colors.textMuted,
  },
  hpBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.buttonDisabled,
    overflow: 'hidden',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  enemyHpFill: {
    backgroundColor: colors.accentWarm,
  },
  hpText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  log: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.buttonDisabled,
  },
  logContent: {
    paddingVertical: 10,
    gap: 4,
  },
  logLine: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerButton: {
    flex: 1,
  },
  outcomePanel: {
    borderTopWidth: 1,
    borderTopColor: colors.buttonDisabled,
    backgroundColor: colors.spaceMid,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  outcomeTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  outcomeBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});
