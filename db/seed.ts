import { db } from './client';
import { categories, runs, targets, users } from './schema';

export async function seedDataIfEmpty() {
  const existingUsers = await db.select().from(users);

  if (existingUsers.length > 0) {
    return;
  }

  await db.insert(users).values([
    {
      name: 'Ruth',
      email: 'ruth@example.com',
      password: 'test123',
    },
  ]);

  await db.insert(categories).values([
    { name: 'Easy', color: '#1446A0', icon: 'walk' },
    { name: 'Long', color: '#F5D547', icon: 'map' },
    { name: 'Tempo', color: '#FF7F11', icon: 'flash' },
    { name: 'Intervals', color: '#ADBDFF', icon: 'timer' },
    { name: 'Race', color: '#DB3069', icon: 'trophy' },
  ]);

  await db.insert(runs).values([
    {
      date: '2026-04-07',
      distanceKm: 5,
      durationMin: 31,
      notes: 'Easy evening run',
      categoryId: 1,
      userId: 1,
    },
    {
      date: '2026-04-09',
      distanceKm: 8,
      durationMin: 46,
      notes: 'Tempo effort',
      categoryId: 3,
      userId: 1,
    },
    {
      date: '2026-04-11',
      distanceKm: 14,
      durationMin: 85,
      notes: 'Long run',
      categoryId: 2,
      userId: 1,
    },
  ]);

  await db.insert(targets).values([
    {
      period: 'weekly',
      metricType: 'distance',
      targetValue: 25,
      categoryId: null,
      userId: 1,
    },
    {
      period: 'weekly',
      metricType: 'runs',
      targetValue: 4,
      categoryId: null,
      userId: 1,
    },
  ]);
}