import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type OptionCardProps = {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  accessory?: React.ReactNode;
};

export function OptionCard({ title, description, selected, onPress, accessory }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.cardPressed]}
    >
      <View style={styles.textBlock}>
        <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {accessory}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.buttonDisabled,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(94, 231, 255, 0.08)',
  },
  cardPressed: {
    backgroundColor: 'rgba(94, 231, 255, 0.14)',
  },
  textBlock: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  titleSelected: {
    color: colors.accent,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
