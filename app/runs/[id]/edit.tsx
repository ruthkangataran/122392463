import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { runs as runsTable, categories as categoriesTable } from '@/db/schema';
import { Run, RunContext, Category } from '../../_layout';



export default function EditRun() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(RunContext);
  const [date, setDate] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const run = context?.runs.find(
    (r: Run) => r.id === Number(id)
  );

  useEffect(() => {
    if (!run) return;
    setDate(run.date);
    setDistanceKm(run.distanceKm.toString());
    setDurationMin(run.durationMin.toString());
    setNotes(run.notes ?? '');
    setSelectedCategoryId(run.categoryId ?? undefined);
  }, [run]);

    useEffect(() => {
        const loadCategories = async () => {
            const rows = await db.select().from(categoriesTable);
            setCategoryList(rows);
        };
        void loadCategories();
    }, []);

  if (!context || !run) return null;

  const { reloadRuns } = context;

  const saveChanges = async () => {
    await db
      .update(runsTable)
      .set({
        date: date.trim(),
        distanceKm: parseFloat(distanceKm),
        durationMin: parseInt(durationMin, 10),
        notes: notes.trim() || null,
        categoryId: selectedCategoryId,
      })
      .where(eq(runsTable.id, Number(id)));

    await reloadRuns();
    router.back()
  };

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
          title={`Update your ${run.distanceKm} km run`}
          subtitle=''
        />
      <View style={styles.form}>
        <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
          <FormField label="Distance (km)" value={distanceKm} onChangeText={setDistanceKm} placeholder="e.g. 5.5" />
          <FormField label="Duration (min)" value={durationMin} onChangeText={setDurationMin} placeholder="e.g. 30" />
          <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="How did it feel?" />
      <Text style={styles.label}>Category</Text>
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

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
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
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
      paddingBottom: 10,
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