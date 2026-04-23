import FormField from '@/components/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable, runs as runsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import {useContext, useEffect, useState} from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { RunContext, Category } from '../_layout';
import {useAuth} from "@/context/AuthContext";
import {useTheme} from "@/context/ThemeContext";


export default function AddRun() {
  const router = useRouter();
  const context = useContext(RunContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const { authState } = useAuth();
  const userId = authState.user?.id ?? 1;
  const {theme} = useTheme();

    useEffect(() => {
        const loadCategories = async () => {
            const rows = await db.select().from(categoriesTable);
            setCategoryList(rows);
            if (rows.length > 0) {
                setSelectedCategoryId(rows[0].id);
            }
        };
        void loadCategories()
    }, []);
    if (!context) return null;
    const { reloadRuns } = context;

  const saveRun = async () => {
      if (!distance || !duration || !selectedCategoryId) return;

    await db.insert(runsTable).values({
      date: date.trim(),
      distanceKm: parseFloat(distance),
      categoryId: selectedCategoryId,
      durationMin: parseInt(duration),
      notes: notes.trim() || null,
      userId: userId,
    });

    await reloadRuns();
    router.back();
  };

  return (
    <View style={[styles.safeArea, {backgroundColor: theme.background}]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Log a Run" subtitle="Record your training session." />

        <View style={styles.form}>
          <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          <FormField label="Distance (km)" value={distance} onChangeText={setDistance} placeholder="e.g. 5.5" />
          <FormField label="Duration (min)" value={duration} onChangeText={setDuration} placeholder="e.g. 30" />
          <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="How did it feel?" />

          <Text style={[styles.label, {color: theme.text}]}>Category</Text>
          <View style={styles.categoryRow}>
            {categoryList.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  accessibilityLabel={`Category ${cat.name}`}
                  accessibilityRole="button"
                  onPress={() => setSelectedCategoryId(cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? cat.color : '#FFFFFF',
                      borderColor: cat.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isSelected ? '#FFFFFF' : cat.color },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <PrimaryButton label="Save Run" onPress={saveRun} />
        <View style={styles.backButton}>
          <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#EBEFFF',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  backButton: {
    marginTop: 10,
  },
  label: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
