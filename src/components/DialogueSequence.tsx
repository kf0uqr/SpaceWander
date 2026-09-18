import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MenuButton } from './MenuButton';
import { colors } from '../theme/colors';

type DialogueSequenceProps = {
  speakerName: string;
  lines: string[];
  onFinish: () => void;
  finishLabel?: string;
  onCancel: () => void;
  cancelLabel?: string;
};

export function DialogueSequence({
  speakerName,
  lines,
  onFinish,
  finishLabel = 'Continue',
  onCancel,
  cancelLabel = 'Leave',
}: DialogueSequenceProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const isLastLine = lineIndex === lines.length - 1;

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>{speakerName}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.line}>{lines[lineIndex]}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <MenuButton label={cancelLabel} onPress={onCancel} variant="secondary" />
          </View>
          <View style={styles.footerButton}>
            <MenuButton
              label={isLastLine ? finishLabel : 'Continue'}
              onPress={() => (isLastLine ? onFinish() : setLineIndex((index) => index + 1))}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 6, 26, 0.7)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.spaceMid,
    borderTopWidth: 1,
    borderTopColor: colors.buttonDisabled,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerEyebrow: {
    color: colors.accentWarm,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    minHeight: 96,
    justifyContent: 'center',
  },
  line: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footerButton: {
    flex: 1,
  },
});
