import { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

function makeStars(count: number, width: number, height: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() < 0.85 ? 1 : Math.random() < 0.97 ? 2 : 3,
      opacity: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

export function Starfield({ density = 120 }: { density?: number }) {
  const { width, height } = useWindowDimensions();
  const stars = useMemo(() => makeStars(density, width, height), [density, width, height]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map((star, index) => (
        <View
          key={index}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: colors.star,
  },
});
