import FormField from '@/components/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { targets as targetsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useContext, useEffect, useState } from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View,} from 'react-native';
import { RunContext } from '../_layout';

type Target = {
    id: number;
    period: string;
    metricType: string;
    targetValue: number;
    categoryId: number | null;
    userId: number;
};

function getStartofWeek(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0? -6 :1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
}

function getStartOfMonth(): string {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
}

export default function TargetsScreen() {
    const context = useContext(RunContext);
    const [targetList, setTargetList] = useState<Target[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [metricType, setMetricType] = useState<'distance' | 'runs'>("distance");
    const [targetValue, setTargetValue] = useState('');
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    useEffect(() => {
        void loadTargets();
    }, []);

    const loadTargets = async () => {
        const rows = await db.select().from(targetsTable);
        setTargetList(rows);
    };

    const getBarColor = (percentage: number) => {
        if (percentage >= 100) return '#2E8B57';
        if (percentage >= 60) return '#ADBDFF';
        if (percentage >= 30) return '#FF7F11';
        return '#DB3069';
    };

    if (!context) return null;
    const {runs} = context;
    const weekStart = getStartofWeek()
    const thisWeekRuns = runs.filter((r) => r.date >= weekStart)
    const weeklyDistance = thisWeekRuns.reduce((sum, r) => sum + r.distanceKm, 0);
    const weeklyRunCount = thisWeekRuns.length;

    const getProgress = (target: Target) => {
        if (target.period === "weekly") {
            const actual =
                target.metricType === 'distance' ? weeklyDistance : weeklyRunCount;
            return {actual, percentage: Math.min((actual/ target.targetValue) * 100, 100)};
        }
        const monthStart = getStartOfMonth();
        const monthRuns = runs.filter((r) => r.date >= monthStart);
        const actual =
            target.metricType === 'distance' ? monthRuns.reduce((sum, r) => sum + r.distanceKm, 0)
                : monthRuns.length;
        return {actual, percentage: Math.min((actual/ target.targetValue) * 100, 100)};
    };

    const getMetricLabel = (target: Target) => {
        if (target.metricType === 'distance') return 'km';
        return 'runs';
    };

    const saveTarget = async () => {
        const value = parseFloat(targetValue);
        if (isNaN(value) || value <= 0) return;

        await db.insert(targetsTable).values({
            period,
            metricType: metricType,
            targetValue: value,
            categoryId: null,
            userId: 1,
        });

        setTargetValue('');
        setShowForm(false);
        await loadTargets();
    };

    const deleteTarget = async (targetId: number) => {
        await db.delete(targetsTable).where(eq(targetsTable.id, targetId));
        await loadTargets();
    };

return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Targets"
          subtitle="Track your weekly and monthly goals"
        />

        {/* Target Cards */}
        {targetList.length === 0 ? (
          <Text style={styles.emptyText}>
            No targets set yet. Add one to start tracking your goals!
          </Text>
        ) : (
          [...targetList]
              .sort((a, b) => {
                  const aMet = getProgress(a).percentage >= 100;
                  const bMet = getProgress(b).percentage >= 100;
                  if (aMet === bMet) return 0;
                  if (aMet) return 1;
                  return -1;
              })
              .map((target) => {
            const { actual, percentage } = getProgress(target);
            const barColor = getBarColor(percentage);
            const unit = getMetricLabel(target);
            const met = percentage >= 100;

            return (
              <View key={target.id} style={styles.targetCard}>
                <View style={styles.targetHeader}>
                  <View>
                    <Text style={styles.targetTitle}>
                      {target.targetValue} {unit} / {target.period === 'weekly' ? 'week' : 'month'}
                    </Text>
                    <Text style={styles.targetSubtitle}>
                      {target.metricType === 'distance' ? 'Distance' : 'Run count'} target
                    </Text>
                  </View>

                  {met ? (
                    <View style={styles.metBadge}>
                      <Text style={styles.metBadgeText}>Met!</Text>
                    </View>
                  ) : null}
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                      },
                    ]}
                  />
                </View>

                <View style={styles.progressRow}>
                  <Text style={styles.progressText}>
                    {actual.toFixed(1)} / {target.targetValue} {unit}
                  </Text>
                  <Text style={[styles.progressPercent, { color: barColor }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>

                {/* Remaining */}
                {!met ? (
                  <Text style={styles.remainingText}>
                    {(target.targetValue - actual).toFixed(1)} {unit} remaining
                  </Text>
                ) : null}

                <Pressable
                  accessibilityLabel={`Delete ${target.metricType} target`}
                  accessibilityRole="button"
                  onPress={() => deleteTarget(target.id)}
                  style={styles.deleteLink}
                >
                  <Text style={styles.deleteLinkText}>Remove</Text>
                </Pressable>
              </View>
            );
          })
        )}

        {/* Add Target */}
        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Target</Text>

            {/* Period picker */}
            <Text style={styles.label}>Period</Text>
            <View style={styles.chipRow}>
              {(['weekly', 'monthly'] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.chip,
                    period === p ? styles.chipSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      period === p ? styles.chipTextSelected : null,
                    ]}
                  >
                    {p === 'weekly' ? 'Weekly' : 'Monthly'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Metric type picker */}
            <Text style={styles.label}>Metric</Text>
            <View style={styles.chipRow}>
              {(['distance', 'runs'] as const).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMetricType(m)}
                  style={[
                    styles.chip,
                    metricType === m ? styles.chipSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      metricType === m ? styles.chipTextSelected : null,
                    ]}
                  >
                    {m === 'distance' ? 'Distance (km)' : 'Number of runs'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <FormField
              label="Target value"
              value={targetValue}
              onChangeText={setTargetValue}
              placeholder={metricType === 'distance' ? 'e.g. 25' : 'e.g. 4'}
            />

            <PrimaryButton label="Save Target" onPress={saveTarget} />
            <View style={styles.buttonSpacing}>
              <PrimaryButton
                label="Cancel"
                variant="secondary"
                onPress={() => setShowForm(false)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.addButtonWrapper}>
            <PrimaryButton
              label="Add Target"
              onPress={() => setShowForm(true)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
  },

  // Target card
  targetCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  targetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  targetTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  targetSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 2,
  },
  metBadge: {
    backgroundColor: '#2E8B57',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  metBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Progress bar
  progressBarBg: {
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    height: 12,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    borderRadius: 6,
    height: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  remainingText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  deleteLink: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 4,
  },
  deleteLinkText: {
    color: '#C53030',
    fontSize: 13,
    fontWeight: '500',
  },

  // Form
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  formTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#1446A0',
    borderColor: '#1446A0',
  },
  chipText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  buttonSpacing: {
    marginTop: 10,
  },
  addButtonWrapper: {
    marginTop: 20,
  },
});
