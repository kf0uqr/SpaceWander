import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { WorldStatus } from '../lib/worldProgress';

type WorldNodeProps = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: WorldStatus;
  selected: boolean;
  onPress: () => void;
};

const NODE_COLOR: Record<WorldStatus, string> = {
  current: colors.nodeCurrent,
  unlocked: colors.nodeUnlocked,
  locked: colors.nodeLocked,
};

export function WorldNode({ name, x, y, width, height, status, selected, onPress }: WorldNodeProps) {
  const color = NODE_COLOR[status];
  const left = x * width;
  const top = y * height;

  return (
    <Pressable
      onPress={onPress}
      disabled={status === 'locked'}
      hitSlop={12}
      style={[styles.wrapper, { left, top }]}
    >
      <View
        style={[
          styles.dot,
          { borderColor: color },
          status === 'current' && styles.dotCurrent,
          selected && { backgroundColor: color },
        ]}
      >
        {status === 'locked' && <View style={styles.lockDot} />}
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { color },
          status === 'locked' && styles.labelLocked,
        ]}
      >
        {status === 'locked' ? '???' : name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -40 }, { translateY: -14 }],
    width: 80,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: colors.spaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    shadowColor: colors.nodeCurrent,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  lockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.nodeLocked,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelLocked: {
    fontStyle: 'italic',
  },
});
