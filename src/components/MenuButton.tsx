import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

type MenuButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function MenuButton({ label, onPress, disabled, variant = 'primary' }: MenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(94, 231, 255, 0.08)',
  },
  buttonSecondary: {
    borderColor: colors.textMuted,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    borderColor: colors.buttonDisabled,
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: 'rgba(94, 231, 255, 0.2)',
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
