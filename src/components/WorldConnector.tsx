import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type WorldConnectorProps = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  width: number;
  height: number;
  dimmed?: boolean;
};

export function WorldConnector({ from, to, width, height, dimmed }: WorldConnectorProps) {
  const x1 = from.x * width;
  const y1 = from.y * height;
  const x2 = to.x * width;
  const y2 = to.y * height;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.line,
        {
          left: x1,
          top: y1 - 1,
          width: length,
          transform: [{ rotate: `${angle}deg` }],
          opacity: dimmed ? 0.25 : 0.6,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: colors.connector,
    transformOrigin: '0 50%',
  },
});
