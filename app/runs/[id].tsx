import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import PrimaryButton from '@/components/ui/primary-button';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { runs as runsTable } from '@/db/schema';
import { Run, RunContext } from '../_layout';

export default function RunDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(RunContext);

  if (!context) return null;

  const { runs, reloadRuns } = context;

  const run = runs.find((r: Run) => r.id === Number(id));

  if (!run) return null;

  const pace = (run.durationMin / run.distanceKm).toFixed(2);
  const categoryColor = run.categoryColor ?? '#94A3B8';
  const tintedBackground = `${categoryColor}10`;

  const confirmDelete = () => {
    Alert.alert(
      'Delete Run',
      'Are you sure you want to delete this run? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteRun },
      ]
    );
  };

  const deleteRun = async () => {
    await db.delete(runsTable).where(eq(runsTable.id, Number(id)));
    await reloadRuns();
    router.back();
  };

  return (
    <View style={[styles.safeArea, {backgroundColor: tintedBackground}]}>
      {/* Category colour accent bar */}
      <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />

      {/* Hero section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroDistance}>{run.distanceKm}</Text>
        <Text style={styles.heroUnit}>km</Text>
      </View>

      <View style={styles.categoryBadgeRow}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryBadgeText}>{run.categoryName}</Text>
        </View>
        <Text style={styles.dateText}>{run.date}</Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, {borderColor: categoryColor}]}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{run.durationMin}</Text>
          <Text style={styles.statUnit}>minutes</Text>
        </View>

        <View style={[styles.statCard, {borderColor: categoryColor}]}>
          <Text style={styles.statLabel}>Pace</Text>
          <Text style={styles.statValue}>{pace}</Text>
          <Text style={styles.statUnit}>min/km</Text>
        </View>
      </View>

      {/* Notes */}
      {run.notes ? (
        <View style={[styles.notesCard, {borderColor: categoryColor}]}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{run.notes}</Text>
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          label="Edit Run"
          onPress={() =>
            router.push({
              pathname: '/runs/[id]/edit',
              params: { id },
            })
          }
        />

        <Pressable
          accessibilityLabel="Delete run"
          accessibilityRole="button"
          onPress={confirmDelete}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete this run</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },

  // Accent bar
  accentBar: {
    borderRadius: 4,
    height: 6,
    marginBottom: 20,
    width: '100%',
  },

  // Hero
  heroSection: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroDistance: {
    color: '#0F172A',
    fontSize: 56,
    fontWeight: '800',
  },
  heroUnit: {
    color: '#64748B',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Category badge + date
  categoryBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  categoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 16,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  statUnit: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },

  // Notes
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  notesLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesText: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },

  // Actions
  actions: {
    marginTop: 'auto',
    paddingBottom: 10,
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 10,
  },
  deleteText: {
    color: '#C53030',
    fontSize: 15,
    fontWeight: '500',
  },
});