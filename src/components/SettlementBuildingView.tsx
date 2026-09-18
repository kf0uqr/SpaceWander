import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { BuildingKind } from '../data/settlements/types';

type SettlementBuildingViewProps = {
  name: string;
  kind: BuildingKind;
  x: number;
  y: number;
  width: number;
  height: number;
};

const KIND_COLOR: Record<BuildingKind, string> = {
  spaceport: colors.spaceport,
  hall: colors.hall,
  shop: colors.shop,
  house: colors.house,
  exit: colors.exitZone,
};

export function SettlementBuildingView({ name, kind, x, y, width, height }: SettlementBuildingViewProps) {
  const color = KIND_COLOR[kind];

  if (kind === 'exit') {
    return (
      <View pointerEvents="none" style={[styles.exitZone, { left: x, top: y, width, height, borderColor: color }]}>
        <Text style={styles.exitLabel}>{name}</Text>
      </View>
    );
  }

  return (
    <View pointerEvents="none">
      <View style={[styles.building, { left: x, top: y, width, height, backgroundColor: color }]} />
      <Text
        numberOfLines={1}
        style={[styles.label, { left: x - 20, top: y - 18, width: width + 40 }]}
      >
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 3,
  },
  building: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  exitZone: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitLabel: {
    color: colors.exitZone,
    fontSize: 11,
    fontWeight: '700',
  },
});
