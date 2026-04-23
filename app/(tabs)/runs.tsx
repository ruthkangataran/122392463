import RunCard from '@/components/RunCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import { Run, RunContext } from '../_layout';
import {getStartOfWeek, getStartOfMonth} from "@/lib/utils";
import {useTheme} from "@/context/ThemeContext";

type DateFilter = 'All' | 'This Week' | 'This Month';

export default function RunIndexScreen() {
  const router = useRouter();
  const context = useContext(RunContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('All');
  const {theme} = useTheme();

  if (!context) return null;

  const { runs } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // making the category options
  const categoryOptions = [
    'All',
    ...Array.from(new Set(runs.map((run: Run) => String(run.categoryName)))).sort(
      (a, b) => Number(a) - Number(b)
    ),
  ];

  const weekStart = getStartOfWeek();
  const monthStart = getStartOfMonth();
// filtering/searching the runs based on notes, date or the category
  const filteredRuns = runs.filter((run: Run) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      run.notes?.toLowerCase().includes(normalizedQuery) ||
      run.date.toLowerCase().includes(normalizedQuery) ||
      run.categoryName.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === 'All' || String(run.categoryName) === selectedCategory;

    const matchesDate =
        dateFilter === "All" ||
        ( dateFilter === "This Week" && run.date >=weekStart) ||
        (dateFilter === 'This Month' && run.date >= monthStart);

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <View style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <ScreenHeader
        title="My Runs"
        subtitle={`${runs.length} runs logged`}
      />

      <PrimaryButton
        label="Log Run"
        onPress={() => router.push({ pathname: '../add' })}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by notes, date or category"
        style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
      />
        <View style={styles.filterRow}>
        {(['All', 'This Week', 'This Month'] as DateFilter[]).map((option) => {
          const isSelected = dateFilter === option;
          return (
            <Pressable
              key={option}
              accessibilityLabel={`Filter by ${option}`}
              accessibilityRole="button"
              onPress={() => setDateFilter(option)}
              style={[
                styles.dateFilterButton,
                isSelected && styles.dateFilterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.dateFilterText,
                  isSelected && styles.dateFilterTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filterRow}>
        {categoryOptions.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <Pressable
              key={category}
              accessibilityLabel={`Filter by ${category}`}
              accessibilityRole="button"
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isSelected && styles.filterButtonTextSelected,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRuns.length === 0 ? (
          <Text style={styles.emptyText}>No runs match your filters</Text>
        ) : (
          filteredRuns.map((run: Run) => (
            <RunCard key={run.id} run={run} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#EBEFFF',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
    dateFilterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1446A0',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dateFilterButtonSelected: {
    backgroundColor: '#1446A0',
  },
  dateFilterText: {
    color: '#1446A0',
    fontSize: 13,
    fontWeight: '600',
  },
    dateFilterTextSelected: {
    color: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
