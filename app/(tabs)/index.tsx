import { useContext, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RunContext } from '../_layout';
import StatCard from '@/components/StatCard';
import RunCard from '@/components/RunCard';
import { getStartOfWeek } from '@/lib/utils';
import StretchSuggestion from "@/components/Exercises";
import StreakCard from "@/components/SteakCard";

type IoniconName = keyof typeof Ionicons.glyphMap;


export default function HomeScreen() {
  const router = useRouter();
  const context = useContext(RunContext);
  const runs = context?.runs ?? [];
  const weekStart = getStartOfWeek();
  const thisWeekRuns = useMemo(
    () => runs.filter((r) => r.date >= weekStart),
    [runs, weekStart]
  );
  const totalDistance = thisWeekRuns.reduce((sum, r) => sum + r.distanceKm, 0);
  const totalRuns = thisWeekRuns.length;
  const totalDuration = thisWeekRuns.reduce((sum, r) => sum + r.durationMin, 0);
  const avgPace =
    totalDistance > 0 ? (totalDuration / totalDistance).toFixed(2) : '0.00';

  const recentRuns = useMemo(
    () =>
      [...runs]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [runs]
  );
    if (!context) return null;


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* This week summary */}
      <SectionTitle title="This Week" />
      <View style={styles.statsGrid}>
        <StatCard label="Distance" value={totalDistance.toFixed(1)} unit="km" icon="footsteps-outline" color="blue" />
        <StatCard label="Runs" value={totalRuns} unit="sessions" icon="fitness-outline" color="orange" />
        <StatCard label="Duration" value={totalDuration} unit="min" icon="time-outline" color="pink" />
        <StatCard label="Avg Pace" value={avgPace} unit="min/km" icon="speedometer-outline" color="green" />
      </View>
        <StreakCard runs={runs} />
        <StretchSuggestion />


      {/* Recent Runs */}
      <Pressable onPress={() => router.push('/(tabs)/runs')}>
        <SectionTitle title="Recent Runs" />
      </Pressable>

      {recentRuns.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="walk-outline" size={32} color="#94A3B8" />
          <Text style={styles.emptyText}>No runs logged yet</Text>
          <Text style={styles.emptySubtext}>Tap Log Run to get started!</Text>
        </View>
      ) : (
        recentRuns.map((run) => <RunCard key={run.id} run={run} />)
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>SteadyPace</Text>
        <Text style={styles.footerSubtext}>Ruth Kangataran 2026</Text>
      </View>
    </ScrollView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEFFF',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // Section
  sectionTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 22,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },


  // Empty state
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 28,
  },
  emptyText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtext: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  footerSubtext: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 2,
  },
});