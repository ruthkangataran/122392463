// https://youtu.be/AkujZtOz9c4?si=GRn0CLI5wMewTZed
import { useContext, useState } from 'react';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text, Dimensions, Pressable, ScrollView } from 'react-native';
import { RunContext } from '../_layout';
import {BarChart} from 'react-native-gifted-charts';
import {getStartOfMonth, getStartOfWeek} from "@/lib/utils";
import StatCard from '@/components/StatCard';

type Period = 'weekly' | 'monthly';

const screenWidth = Dimensions.get('window').width - 40;
const dayLabels = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const weekLabels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'];

export default function InsightsScreen() {
    const context = useContext(RunContext);
    const [period, setPeriod] = useState<Period>('weekly');
    if (!context) return null;
    const {runs} = context;

    const weekStart = getStartOfWeek();
    const monthStart = getStartOfMonth();

    const filteredRuns =
        period === 'weekly'
    ? runs.filter((r) => r.date >= weekStart)
            : runs.filter((r) => r.date >= monthStart);
    const totalDistance = filteredRuns.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalRuns = filteredRuns.length;
    const totalDuration = filteredRuns.reduce((sum, r) => sum + r.durationMin, 0);
    const avgPace =
    totalDistance > 0 ? (totalDuration / totalDistance).toFixed(2) : '0.00';

    const getWeeklyChartData = () => {
    const monday = new Date(weekStart);
    return dayLabels.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const value = runs
        .filter((r) => r.date === dateStr)
        .reduce((sum, r) => sum + r.distanceKm, 0);

      return {
        value,
        label,
        frontColor: value > 0 ? '#1446A0' : '#E2E8F0',
        topLabelComponent: () =>
          value > 0 ? (
            <Text style={styles.barLabel}>{value.toFixed(1)}</Text>
          ) : null,
      };
    });
  };
    const getMonthlyChartData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return weekLabels.map((label, i) => {
      const wkStart = new Date(year, month, 1 + i * 7);
      const wkEnd = new Date(
        year,
        month,
        Math.min(1 + (i + 1) * 7, new Date(year, month + 1, 0).getDate() + 1)
      );
      const wkStartStr = wkStart.toISOString().split('T')[0];
      const wkEndStr = wkEnd.toISOString().split('T')[0];

      const value = runs
        .filter((r) => r.date >= wkStartStr && r.date < wkEndStr)
        .reduce((sum, r) => sum + r.distanceKm, 0);

      return {
        value,
        label,
        frontColor: value > 0 ? '#1446A0' : '#E2E8F0',
        topLabelComponent: () =>
          value > 0 ? (
            <Text style={styles.barLabel}>{value.toFixed(1)}</Text>
          ) : null,
      };
    });
  };
     const chartData =
    period === 'weekly' ? getWeeklyChartData() : getMonthlyChartData();
     const categoryMap: Record<string, { count: number; distance: number; color: string }> = {};
  filteredRuns.forEach((r) => {
    if (!categoryMap[r.categoryName]) {
      categoryMap[r.categoryName] = { count: 0, distance: 0, color: r.categoryColor ?? '#94A3B8' };
    }
    categoryMap[r.categoryName].count += 1;
    categoryMap[r.categoryName].distance += r.distanceKm;
  });
  const categoryBreakdown = Object.entries(categoryMap).sort(
    (a, b) => b[1].distance - a[1].distance
  );

return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Insights"
          subtitle="See how your training is going"
        />

        {/* Period toggle */}
        <View style={styles.toggleRow}>
          {(['weekly', 'monthly'] as const).map((p) => (
            <Pressable
              key={p}
              accessibilityLabel={`Show ${p} insights`}
              accessibilityRole="button"
              onPress={() => setPeriod(p)}
              style={[styles.toggleChip, period === p ? styles.toggleChipSelected : null]}
            >
              <Text
                style={[
                  styles.toggleChipText,
                  period === p ? styles.toggleChipTextSelected : null,
                ]}
              >
                {p === 'weekly' ? 'This Week' : 'This Month'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Summary stats */}
          <View style={styles.statsGrid}>
              <StatCard label="Distance" value={totalDistance.toFixed(1)} unit="km" icon="footsteps-outline" color="blue" />
              <StatCard label="Runs" value={totalRuns} unit="sessions" icon="fitness-outline" color="orange" />
              <StatCard label="Duration" value={totalDuration} unit="min" icon="time-outline" color="pink" />
              <StatCard label="Avg Pace" value={avgPace} unit="min/km" icon="speedometer-outline" color="green" />
            </View>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {period === 'weekly' ? 'Daily Distance (km)' : 'Weekly Distance (km)'}
          </Text>
          <BarChart
            data={chartData}
            barWidth={screenWidth / (chartData.length * 2.5)}
            spacing={screenWidth / (chartData.length * 3)}
            roundedTop
            roundedBottom
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor="#E2E8F0"
            rulesColor="#E2E8F0"
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            isAnimated
            animationDuration={600}
          />
        </View>

        {/* Category breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>

          {categoryBreakdown.length === 0 ? (
            <Text style={styles.emptyText}>No runs this {period === 'weekly' ? 'week' : 'month'}</Text>
          ) : (
            categoryBreakdown.map(([name, data]) => {
              const percent =
                totalDistance > 0
                  ? ((data.distance / totalDistance) * 100).toFixed(0)
                  : '0';

              return (
                <View key={name} style={styles.breakdownRow}>
                  <View style={[styles.breakdownDot, { backgroundColor: data.color }]} />
                  <View style={styles.breakdownInfo}>
                    <Text style={styles.breakdownName}>{name}</Text>
                    <Text style={styles.breakdownDetail}>
                      {data.count} {data.count === 1 ? 'run' : 'runs'} • {data.distance.toFixed(1)} km
                    </Text>
                  </View>
                  <Text style={[styles.breakdownPercent, { color: data.color }]}>
                    {percent}%
                  </Text>
                </View>
              );
            })
          )}
        </View>
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

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 16,
  },
  toggleChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleChipSelected: {
    backgroundColor: '#1446A0',
    borderColor: '#1446A0',
  },
  toggleChipText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleChipTextSelected: {
    color: '#FFFFFF',
  },

  // Stats grid
  statsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 16,
},

  // Chart
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  barLabel: {
    color: '#1446A0',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  axisText: {
    color: '#64748B',
    fontSize: 11,
  },

  // Category breakdown
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  breakdownRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  breakdownDot: {
    borderRadius: 999,
    height: 12,
    width: 12,
  },
  breakdownInfo: {
    flex: 1,
    marginLeft: 10,
  },
  breakdownName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
  },
  breakdownDetail: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 1,
  },
  breakdownPercent: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

