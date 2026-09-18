import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MenuButton } from './MenuButton';
import { colors } from '../theme/colors';
import { Mission } from '../data/missions/types';

type MissionBoardProps = {
  missions: Mission[];
  acceptedMissionIds: string[];
  onAccept: (missionId: string) => void;
  onClose: () => void;
};

export function MissionBoard({ missions, acceptedMissionIds, onAccept, onClose }: MissionBoardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMission = missions.find((mission) => mission.id === selectedId) ?? null;

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>Settlement Hall</Text>
          <Text style={styles.headerTitle}>{selectedMission ? selectedMission.title : 'Mission Board'}</Text>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {!selectedMission &&
            (missions.length === 0 ? (
              <Text style={styles.emptyText}>No missions posted yet. Check back soon, Captain.</Text>
            ) : (
              <View style={styles.list}>
                {missions.map((mission) => {
                  const accepted = acceptedMissionIds.includes(mission.id);
                  return (
                    <Pressable key={mission.id} style={styles.postCard} onPress={() => setSelectedId(mission.id)}>
                      <View style={styles.postHeader}>
                        <Text style={styles.postTitle}>{mission.title}</Text>
                        <View style={[styles.badge, accepted && styles.badgeAccepted]}>
                          <Text style={[styles.badgeText, accepted && styles.badgeTextAccepted]}>
                            {accepted ? 'Accepted' : 'Available'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.postSummary}>{mission.summary}</Text>
                      <Text style={styles.postContact}>
                        Talk to {mission.giverName} — {mission.giverLocation}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}

          {selectedMission && (
            <View>
              <Text style={styles.detailDescription}>{selectedMission.description}</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Talk to</Text>
                <Text style={styles.detailValue}>{selectedMission.giverName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Find them at</Text>
                <Text style={styles.detailValue}>{selectedMission.giverLocation}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reward</Text>
                <Text style={styles.detailValue}>{selectedMission.reward}</Text>
              </View>

              <View style={styles.acceptRow}>
                {acceptedMissionIds.includes(selectedMission.id) ? (
                  <Text style={styles.acceptedNote}>You've already accepted this mission.</Text>
                ) : (
                  <MenuButton label="Accept Mission" onPress={() => onAccept(selectedMission.id)} />
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <MenuButton
              label={selectedMission ? 'Back to Board' : 'Close'}
              onPress={() => (selectedMission ? setSelectedId(null) : onClose())}
              variant="secondary"
            />
          </View>
          {selectedMission && (
            <View style={styles.footerButton}>
              <MenuButton label="Close" onPress={onClose} variant="secondary" />
            </View>
          )}
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
    maxHeight: '82%',
    backgroundColor: colors.spaceMid,
    borderTopWidth: 1,
    borderTopColor: colors.buttonDisabled,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.buttonDisabled,
  },
  headerEyebrow: {
    color: colors.accentWarm,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    padding: 20,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  postCard: {
    borderWidth: 1,
    borderColor: colors.buttonDisabled,
    borderRadius: 10,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  postTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.accentWarm,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeAccepted: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(94, 231, 255, 0.12)',
  },
  badgeText: {
    color: colors.accentWarm,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badgeTextAccepted: {
    color: colors.accent,
  },
  postSummary: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  postContact: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  detailDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.buttonDisabled,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 13,
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  acceptRow: {
    marginTop: 20,
  },
  acceptedNote: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
