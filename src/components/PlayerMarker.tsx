import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export const PLAYER_RADIUS = 14;

export function PlayerMarker({ x, y }: { x: number; y: number }) {
  return (
    <View pointerEvents="none" style={[styles.wrapper, { left: x - PLAYER_RADIUS, top: y - PLAYER_RADIUS }]}>
      <View style={styles.dot} />
      <View style={styles.shadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: PLAYER_RADIUS * 2,
    height: PLAYER_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: PLAYER_RADIUS * 2,
    height: PLAYER_RADIUS * 2,
    borderRadius: PLAYER_RADIUS,
    backgroundColor: colors.player,
    borderWidth: 2,
    borderColor: colors.spaceDeep,
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    bottom: -4,
    width: PLAYER_RADIUS * 1.4,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
