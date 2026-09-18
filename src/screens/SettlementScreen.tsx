import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { DustGround } from '../components/DustGround';
import { SettlementBuildingView } from '../components/SettlementBuildingView';
import { PlayerMarker, PLAYER_RADIUS } from '../components/PlayerMarker';
import { MissionBoard } from '../components/MissionBoard';
import { colors } from '../theme/colors';
import { resolveMove, getApproachPoint, Point } from '../lib/collision';
import { Settlement, SettlementBuilding } from '../data/settlements/types';
import { SaveGame } from '../lib/saveGame';
import { getAppearance } from '../data/character/appearance';
import { getMissionsForWorld } from '../data/missions';

const MOVE_SPEED = 260; // px/sec
const ARRIVE_THRESHOLD = 4;
const HEADER_HEIGHT = 76;
const TAP_PADDING = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampCamera(playerValue: number, viewport: number, mapSize: number) {
  if (mapSize <= viewport) return -(mapSize - viewport) / 2;
  return clamp(playerValue - viewport / 2, 0, mapSize - viewport);
}

type SettlementScreenProps = {
  save: SaveGame;
  settlement: Settlement;
  onOpenStarMap: () => void;
  onBackToTitle: () => void;
  onAcceptMission: (missionId: string) => void;
};

export function SettlementScreen({
  save,
  settlement,
  onOpenStarMap,
  onBackToTitle,
  onAcceptMission,
}: SettlementScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [viewport, setViewport] = useState({
    width: screenWidth,
    height: Math.max(screenHeight - HEADER_HEIGHT, 200),
  });
  const [playerPos, setPlayerPos] = useState<Point>(settlement.playerSpawn);
  const [activeInteraction, setActiveInteraction] = useState<SettlementBuilding | null>(null);
  const [missionBoardOpen, setMissionBoardOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const missions = getMissionsForWorld(settlement.worldId);

  const playerPosRef = useRef<Point>(settlement.playerSpawn);
  const targetRef = useRef<Point | null>(null);
  const pendingInteractionRef = useRef<SettlementBuilding | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const solidRects = settlement.buildings
    .filter((building) => building.solid)
    .map((building) => ({ x: building.x, y: building.y, width: building.width, height: building.height }));

  const triggerInteraction = useCallback((building: SettlementBuilding) => {
    if (building.kind === 'hall') {
      setMissionBoardOpen(true);
    } else {
      setActiveInteraction(building);
    }
  }, []);

  useEffect(() => {
    playerPosRef.current = settlement.playerSpawn;
    setPlayerPos(settlement.playerSpawn);
    targetRef.current = null;
    pendingInteractionRef.current = null;
  }, [settlement]);

  useEffect(() => {
    function step(timestamp: number) {
      const last = lastTimeRef.current ?? timestamp;
      const dt = Math.min((timestamp - last) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const target = targetRef.current;
      if (target) {
        const pos = playerPosRef.current;
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist < ARRIVE_THRESHOLD) {
          playerPosRef.current = target;
          setPlayerPos(target);
          targetRef.current = null;
          const interaction = pendingInteractionRef.current;
          pendingInteractionRef.current = null;
          if (interaction) triggerInteraction(interaction);
        } else {
          const moveDist = Math.min(MOVE_SPEED * dt, dist);
          const ux = dx / dist;
          const uy = dy / dist;
          const next = resolveMove(pos, ux * moveDist, uy * moveDist, PLAYER_RADIUS, solidRects);
          next.x = clamp(next.x, PLAYER_RADIUS, settlement.mapWidth - PLAYER_RADIUS);
          next.y = clamp(next.y, PLAYER_RADIUS, settlement.mapHeight - PLAYER_RADIUS);
          playerPosRef.current = next;
          setPlayerPos(next);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlement]);

  const cameraX = clampCamera(playerPos.x, viewport.width, settlement.mapWidth);
  const cameraY = clampCamera(playerPos.y, viewport.height, settlement.mapHeight);

  function handleViewportLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setViewport({ width, height });
  }

  function handleTap(event: GestureResponderEvent) {
    if (activeInteraction || missionBoardOpen) return;
    // pageX/pageY are relative to the full window on both web and native, unlike
    // locationX/locationY which on web are relative to whatever DOM node the tap
    // happened to land on (so its origin shifts per element, not per viewport).
    const { pageX, pageY } = event.nativeEvent;
    const localX = pageX - insets.left;
    const localY = pageY - insets.top - HEADER_HEIGHT;
    const worldX = localX + cameraX;
    const worldY = localY + cameraY;

    const hit = settlement.buildings.find(
      (building) =>
        worldX >= building.x - TAP_PADDING &&
        worldX <= building.x + building.width + TAP_PADDING &&
        worldY >= building.y - TAP_PADDING &&
        worldY <= building.y + building.height + TAP_PADDING,
    );

    if (hit) {
      const rect = { x: hit.x, y: hit.y, width: hit.width, height: hit.height };
      targetRef.current = hit.solid
        ? getApproachPoint(rect, PLAYER_RADIUS + 6, playerPosRef.current)
        : { x: hit.x + hit.width / 2, y: hit.y + hit.height / 2 };
      pendingInteractionRef.current = hit;
    } else {
      targetRef.current = {
        x: clamp(worldX, PLAYER_RADIUS, settlement.mapWidth - PLAYER_RADIUS),
        y: clamp(worldY, PLAYER_RADIUS, settlement.mapHeight - PLAYER_RADIUS),
      };
      pendingInteractionRef.current = null;
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>{settlement.name}</Text>
          <Text style={styles.headerTitle}>{save.character.name}</Text>
        </View>
        <View style={styles.headerButtons}>
          <MenuButton label="Star Map" onPress={onOpenStarMap} variant="secondary" />
          <MenuButton label="Title" onPress={onBackToTitle} variant="secondary" />
        </View>
      </View>

      <Pressable style={styles.viewport} onLayout={handleViewportLayout} onPress={handleTap}>
        <View
          style={[
            styles.world,
            { width: settlement.mapWidth, height: settlement.mapHeight, left: -cameraX, top: -cameraY },
          ]}
        >
          <DustGround width={settlement.mapWidth} height={settlement.mapHeight} />
          {settlement.buildings.map((building) => (
            <SettlementBuildingView
              key={building.id}
              name={building.name}
              kind={building.kind}
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
            />
          ))}
          <PlayerMarker x={playerPos.x} y={playerPos.y} color={getAppearance(save.character.appearanceId)?.color} />
        </View>
      </Pressable>

      {activeInteraction && (
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>{activeInteraction.name}</Text>
          <Text style={styles.dialogBody}>{activeInteraction.message}</Text>
          <View style={styles.dialogFooter}>
            <MenuButton label="Close" onPress={() => setActiveInteraction(null)} />
          </View>
        </View>
      )}

      {missionBoardOpen && (
        <MissionBoard
          missions={missions}
          acceptedMissionIds={save.acceptedMissionIds}
          onAccept={onAcceptMission}
          onClose={() => setMissionBoardOpen(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dustGroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    height: HEADER_HEIGHT,
    backgroundColor: colors.spaceDeep,
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  world: {
    position: 'absolute',
  },
  dialog: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.buttonDisabled,
    backgroundColor: colors.spaceMid,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dialogTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  dialogBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dialogFooter: {
    flexDirection: 'row',
  },
});
