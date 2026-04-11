import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { runs as runsTable, categories as categoriesTable } from '@/db/schema';
import { seedDataIfEmpty } from '@/db/seed';

export type Run = {
  id: number;
  date: string;
  distanceKm: number;
  durationMin: number;
  notes: string | null;
  categoryId: number;
  userId: number;
  categoryName: string;
  categoryColor: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string | null;
};

type RunContextType = {
  runs: Run[];
  setRuns: React.Dispatch<React.SetStateAction<Run[]>>;
  reloadRuns: () => Promise<void>;
};

export const RunContext = createContext<RunContextType | null>(null);

export default function RootLayout() {
  const [runs, setRuns] = useState<Run[]>([]);

  const reloadRuns = async () => {
    const runRows = await db.select().from(runsTable);
    const categoryRows = await db.select().from(categoriesTable);

    const runsWithCategoryNames: Run[] = runRows.map((run) => {
      const matchingCategory = categoryRows.find(
        (category) => category.id === run.categoryId
      );

      return {
        ...run,
        categoryName: matchingCategory?.name ?? 'Unknown',
          categoryColor: matchingCategory?.color ?? '#fff'
      };
    });

    setRuns(runsWithCategoryNames);
  };

  useEffect(() => {
    const loadData = async () => {
      await seedDataIfEmpty();
      await reloadRuns();
    };

    void loadData();
  }, []);

  return (
    <RunContext.Provider value={{ runs, setRuns, reloadRuns }}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#1446A0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
          headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="runs/[id]" options={{ title: 'Run Details', headerBackButtonDisplayMode: 'minimal' }} />
      <Stack.Screen name="runs/[id]/edit" options={{ title: 'Edit Run', headerBackButtonDisplayMode: 'minimal' }} />
      </Stack>
    </RunContext.Provider>
  );
}