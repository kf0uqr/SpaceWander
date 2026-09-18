import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { Starfield } from '../components/Starfield';
import { WorldConnector } from '../components/WorldConnector';
import { WorldNode } from '../components/WorldNode';
import { colors } from '../theme/colors';
import { getWorld, worlds } from '../data/worlds';
import { getWorldStatus } from '../lib/worldProgress';
import { SaveGame } from '../lib/saveGame';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;

type WorldMapScreenProps = {
  save: SaveGame;
  onTravel: (worldId: string) => void;
  onBackToTitle: () => void;
};

function connectorPairs() {
  const seen = new Set<string>();
  const pairs: [string, string][] = [];
  for (const world of worlds) {
    for (const targetId of world.connections) {
      const key = [world.id, targetId].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push([world.id, targetId]);
    }
  }
  return pairs;
}

export function WorldMapScreen({ save, onTravel, onBackToTitle }: WorldMapScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selectedWorldId, setSelectedWorldId] = useState<string>(save.currentWorldId);
  const pairs = useMemo(connectorPairs, []);
  const verticalRef = useRef<ScrollView>(null);
  const horizontalRef = useRef<ScrollView>(null);

  useEffect(() => {
    const currentWorld = getWorld(save.currentWorldId);
    if (!currentWorld) return;
    const targetY = Math.max(0, currentWorld.y * CANVAS_HEIGHT - screenHeight / 2);
    const targetX = Math.max(0, currentWorld.x * CANVAS_WIDTH - screenWidth / 2);
    verticalRef.current?.scrollTo({ y: targetY, animated: false });
    horizontalRef.current?.scrollTo({ x: targetX, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedWorld = getWorld(selectedWorldId);
  const selectedStatus = selectedWorld
    ? getWorldStatus(selectedWorld, save.currentWorldId, save.visitedWorldIds)
    : 'locked';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Star Chart</Text>
          <Text style={styles.headerTitle}>{save.playerName}'s Voyage</Text>
        </View>
        <MenuButton label="Title" onPress={onBackToTitle} variant="secondary" />
      </View>

      <ScrollView ref={verticalRef} style={styles.vertical} contentContainerStyle={{ height: CANVAS_HEIGHT }}>
        <ScrollView ref={horizontalRef} horizontal contentContainerStyle={{ width: CANVAS_WIDTH }}>
          <View style={[styles.canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }]}>
            <Starfield density={90} />
            {pairs.map(([fromId, toId]) => {
              const from = getWorld(fromId);
              const to = getWorld(toId);
              if (!from || !to) return null;
              const dimmed =
                getWorldStatus(from, save.currentWorldId, save.visitedWorldIds) === 'locked' ||
                getWorldStatus(to, save.currentWorldId, save.visitedWorldIds) === 'locked';
              return (
                <WorldConnector
                  key={`${fromId}-${toId}`}
                  from={from}
                  to={to}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  dimmed={dimmed}
                />
              );
            })}
            {worlds.map((world) => (
              <WorldNode
                key={world.id}
                name={world.name}
                x={world.x}
                y={world.y}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                status={getWorldStatus(world, save.currentWorldId, save.visitedWorldIds)}
                selected={world.id === selectedWorldId}
                onPress={() => setSelectedWorldId(world.id)}
              />
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {selectedWorld && (
        <View style={styles.detailCard}>
          <Text style={styles.detailName}>
            {selectedStatus === 'locked' ? 'Unknown System' : selectedWorld.name}
          </Text>
          <Text style={styles.detailBody}>
            {selectedStatus === 'locked'
              ? 'Travel to a connected world to reveal this system.'
              : selectedWorld.description}
          </Text>
          <View style={styles.detailFooter}>
            <MenuButton
              label={selectedStatus === 'current' ? 'Here' : 'Travel'}
              onPress={() => onTravel(selectedWorld.id)}
              disabled={selectedStatus !== 'unlocked'}
            />
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  vertical: {
    flex: 1,
  },
  canvas: {
    backgroundColor: colors.spaceDeep,
  },
  detailCard: {
    borderTopWidth: 1,
    borderTopColor: colors.buttonDisabled,
    backgroundColor: colors.spaceMid,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  detailName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailFooter: {
    flexDirection: 'row',
  },
});
