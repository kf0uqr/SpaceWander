import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/MenuButton';
import { OptionCard } from '../components/OptionCard';
import { Starfield } from '../components/Starfield';
import { colors } from '../theme/colors';
import { appearanceOptions } from '../data/character/appearance';
import { speciesList, getSpecies } from '../data/character/species';
import { jobsList } from '../data/character/jobs';
import {
  CharacterConfig,
  defaultCharacter,
  SEX_OPTIONS,
  STAT_KEYS,
  STAT_LABELS,
  STAT_MIN,
  STAT_MAX,
  STAT_POINT_POOL,
  statPointsUsed,
} from '../lib/character';

const STEPS = ['name', 'sex', 'species', 'appearance', 'job', 'stats', 'review'] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLES: Record<Step, string> = {
  name: 'Name',
  sex: 'Sex',
  species: 'Species',
  appearance: 'Appearance',
  job: 'Job',
  stats: 'Base Stats',
  review: 'Review',
};

type CharacterCreationScreenProps = {
  onCancel: () => void;
  onComplete: (character: CharacterConfig) => void;
};

export function CharacterCreationScreen({ onCancel, onComplete }: CharacterCreationScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<CharacterConfig>(defaultCharacter());

  const step = STEPS[stepIndex];
  const pointsUsed = statPointsUsed(draft.stats);
  const pointsRemaining = STAT_POINT_POOL - pointsUsed;

  const canAdvance =
    step === 'name' ? draft.name.trim().length > 0 : step === 'stats' ? pointsRemaining === 0 : true;

  function updateDraft(partial: Partial<CharacterConfig>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function adjustStat(key: (typeof STAT_KEYS)[number], delta: number) {
    setDraft((current) => {
      const nextValue = current.stats[key] + delta;
      if (nextValue < STAT_MIN || nextValue > STAT_MAX) return current;
      if (delta > 0 && pointsRemaining <= 0) return current;
      return { ...current, stats: { ...current.stats, [key]: nextValue } };
    });
  }

  function goNext() {
    if (stepIndex === STEPS.length - 1) {
      onComplete({ ...draft, name: draft.name.trim() });
    } else {
      setStepIndex((index) => index + 1);
    }
  }

  function goBack() {
    if (stepIndex === 0) {
      onCancel();
    } else {
      setStepIndex((index) => index - 1);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Starfield density={60} />
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>
          Step {stepIndex + 1} of {STEPS.length}
        </Text>
        <Text style={styles.headerTitle}>{STEP_TITLES[step]}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {step === 'name' && (
          <View>
            <Text style={styles.prompt}>What should we call you, Captain?</Text>
            <TextInput
              value={draft.name}
              onChangeText={(name) => updateDraft({ name })}
              placeholder="Enter a name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              maxLength={24}
              autoFocus
            />
          </View>
        )}

        {step === 'sex' && (
          <View style={styles.optionList}>
            {SEX_OPTIONS.map((option) => (
              <OptionCard
                key={option.id}
                title={option.label}
                selected={draft.sex === option.id}
                onPress={() => updateDraft({ sex: option.id })}
              />
            ))}
          </View>
        )}

        {step === 'species' && (
          <View style={styles.optionList}>
            {speciesList.map((species) => (
              <OptionCard
                key={species.id}
                title={species.name}
                description={species.description}
                selected={draft.speciesId === species.id}
                onPress={() => updateDraft({ speciesId: species.id })}
              />
            ))}
          </View>
        )}

        {step === 'appearance' && (
          <View>
            <Text style={styles.prompt}>Choose your look.</Text>
            <View style={styles.swatchGrid}>
              {appearanceOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.swatchItem}
                  onPress={() => updateDraft({ appearanceId: option.id })}
                >
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: option.color },
                      draft.appearanceId === option.id && styles.swatchSelected,
                    ]}
                  />
                  <Text style={styles.swatchLabel}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 'job' && (
          <View style={styles.optionList}>
            {jobsList.map((job) => (
              <OptionCard
                key={job.id}
                title={job.name}
                description={job.description}
                selected={draft.jobId === job.id}
                onPress={() => updateDraft({ jobId: job.id })}
              />
            ))}
          </View>
        )}

        {step === 'stats' && (
          <View>
            <Text style={styles.prompt}>Points remaining: {pointsRemaining}</Text>
            <View style={styles.statList}>
              {STAT_KEYS.map((key) => (
                <View key={key} style={styles.statRow}>
                  <Text style={styles.statLabel}>{STAT_LABELS[key]}</Text>
                  <View style={styles.statControls}>
                    <MenuButton label="-" onPress={() => adjustStat(key, -1)} variant="secondary" />
                    <Text style={styles.statValue}>{draft.stats[key]}</Text>
                    <MenuButton label="+" onPress={() => adjustStat(key, 1)} variant="secondary" />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 'review' && (
          <View style={styles.reviewList}>
            <ReviewRow label="Name" value={draft.name} />
            <ReviewRow label="Sex" value={SEX_OPTIONS.find((o) => o.id === draft.sex)?.label ?? ''} />
            <ReviewRow label="Species" value={getSpecies(draft.speciesId)?.name ?? ''} />
            <ReviewRow
              label="Appearance"
              value={appearanceOptions.find((o) => o.id === draft.appearanceId)?.label ?? ''}
            />
            <ReviewRow label="Job" value={jobsList.find((j) => j.id === draft.jobId)?.name ?? ''} />
            {STAT_KEYS.map((key) => (
              <ReviewRow key={key} label={STAT_LABELS[key]} value={String(draft.stats[key])} />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <MenuButton label={stepIndex === 0 ? 'Cancel' : 'Back'} onPress={goBack} variant="secondary" />
        </View>
        <View style={styles.footerButton}>
          <MenuButton
            label={stepIndex === STEPS.length - 1 ? 'Begin Voyage' : 'Next'}
            onPress={goNext}
            disabled={!canAdvance}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.spaceDeep,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerEyebrow: {
    color: colors.accentWarm,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  prompt: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  optionList: {
    gap: 12,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  swatchItem: {
    alignItems: 'center',
    width: 70,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: colors.accent,
  },
  swatchLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  statList: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  statControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  reviewList: {
    gap: 2,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.buttonDisabled,
  },
  reviewLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  reviewValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footerButton: {
    flex: 1,
  },
});
