import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type Speck = { x: number; y: number; size: number; opacity: number };

function makeSpecks(count: number, width: number, height: number): Speck[] {
  const specks: Speck[] = [];
  for (let i = 0; i < count; i++) {
    specks.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 3,
      opacity: 0.2 + Math.random() * 0.35,
    });
  }
  return specks;
}

export function DustGround({ width, height }: { width: number; height: number }) {
  const specks = useMemo(() => makeSpecks(Math.round((width * height) / 6000), width, height), [width, height]);

  return (
    <View style={[styles.ground, { width, height }]}>
      {specks.map((speck, index) => (
        <View
          key={index}
          style={[
            styles.speck,
            {
              left: speck.x,
              top: speck.y,
              width: speck.size,
              height: speck.size,
              borderRadius: speck.size,
              opacity: speck.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ground: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: colors.dustGround,
  },
  speck: {
    position: 'absolute',
    backgroundColor: colors.dustSpeck,
  },
});
