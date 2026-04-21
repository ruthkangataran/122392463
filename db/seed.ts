// https://claude.ai/share/15d67bff-675b-4517-a95b-9aaea22568e8
import { db } from './client';
import { categories, runs, targets, users } from './schema';

export async function seedDataIfEmpty() {
  const existingUsers = await db.select().from(users);

  if (existingUsers.length > 0) {
    return;
  }

  // ── Users ──────────────────────────────────────────────
  await db.insert(users).values([
    { name: 'Ruth', email: 'ruth@example.com', password: 'test123' },
    { name: 'Conor', email: 'conor@example.com', password: 'test123' },
    { name: 'Saoirse', email: 'saoirse@example.com', password: 'test123' },
  ]);

  // ── Categories ─────────────────────────────────────────
  await db.insert(categories).values([
    { name: 'Easy', color: '#1446A0', icon: 'walk' },
    { name: 'Long', color: '#F5D547', icon: 'map' },
    { name: 'Tempo', color: '#FF7F11', icon: 'flash' },
    { name: 'Intervals', color: '#ADBDFF', icon: 'timer' },
    { name: 'Race', color: '#DB3069', icon: 'trophy' },
  ]);

  // ── Runs – Ruth (userId: 1) ────────────────────────────
  await db.insert(runs).values([
    // January 2026
    { date: '2026-01-05', distanceKm: 5, durationMin: 32, notes: 'New year shakeout run', categoryId: 1, userId: 1 },
    { date: '2026-01-08', distanceKm: 6, durationMin: 36, notes: 'Cold but felt good', categoryId: 1, userId: 1 },
    { date: '2026-01-11', distanceKm: 12, durationMin: 72, notes: 'First long run of the year', categoryId: 2, userId: 1 },
    { date: '2026-01-14', distanceKm: 5, durationMin: 30, notes: 'Easy recovery', categoryId: 1, userId: 1 },
    { date: '2026-01-17', distanceKm: 7, durationMin: 38, notes: '4x1km intervals, 4:15 avg', categoryId: 4, userId: 1 },
    { date: '2026-01-20', distanceKm: 5, durationMin: 31, notes: 'Rainy but managed it', categoryId: 1, userId: 1 },
    { date: '2026-01-24', distanceKm: 14, durationMin: 84, notes: 'Building the long run', categoryId: 2, userId: 1 },
    { date: '2026-01-27', distanceKm: 6, durationMin: 33, notes: 'Tempo miles felt strong', categoryId: 3, userId: 1 },

    // February 2026
    { date: '2026-02-01', distanceKm: 5, durationMin: 31, notes: 'Easy Sunday jog', categoryId: 1, userId: 1 },
    { date: '2026-02-04', distanceKm: 8, durationMin: 42, notes: '5x800m repeats', categoryId: 4, userId: 1 },
    { date: '2026-02-07', distanceKm: 16, durationMin: 98, notes: 'Longest run yet, legs tired at 13k', categoryId: 2, userId: 1 },
    { date: '2026-02-10', distanceKm: 5, durationMin: 33, notes: 'Very easy recovery, sore calves', categoryId: 1, userId: 1 },
    { date: '2026-02-13', distanceKm: 7, durationMin: 37, notes: 'Tempo – held 5:15/km pace', categoryId: 3, userId: 1 },
    { date: '2026-02-16', distanceKm: 5, durationMin: 30, notes: 'Parkrun PB! 29:45', categoryId: 5, userId: 1 },
    { date: '2026-02-19', distanceKm: 6, durationMin: 37, notes: 'Legs heavy post-race', categoryId: 1, userId: 1 },
    { date: '2026-02-22', distanceKm: 18, durationMin: 112, notes: 'Long run on the coast road', categoryId: 2, userId: 1 },
    { date: '2026-02-25', distanceKm: 5, durationMin: 30, notes: 'Easy shakeout', categoryId: 1, userId: 1 },

    // March 2026
    { date: '2026-03-01', distanceKm: 6, durationMin: 35, notes: 'Spring is coming, warmer today', categoryId: 1, userId: 1 },
    { date: '2026-03-04', distanceKm: 9, durationMin: 46, notes: '6x1km intervals, avg 4:10', categoryId: 4, userId: 1 },
    { date: '2026-03-07', distanceKm: 20, durationMin: 125, notes: 'Half marathon distance! Felt strong', categoryId: 2, userId: 1 },
    { date: '2026-03-10', distanceKm: 5, durationMin: 32, notes: 'Gentle recovery run', categoryId: 1, userId: 1 },
    { date: '2026-03-12', distanceKm: 8, durationMin: 41, notes: 'Tempo – 5:05/km avg', categoryId: 3, userId: 1 },
    { date: '2026-03-15', distanceKm: 21.1, durationMin: 108, notes: 'Half marathon race – 1:47:42!', categoryId: 5, userId: 1 },
    { date: '2026-03-19', distanceKm: 5, durationMin: 34, notes: 'Post-race easy jog', categoryId: 1, userId: 1 },
    { date: '2026-03-22', distanceKm: 10, durationMin: 58, notes: 'Easy long run, taking it steady', categoryId: 2, userId: 1 },
    { date: '2026-03-25', distanceKm: 6, durationMin: 34, notes: 'Evening run around the park', categoryId: 1, userId: 1 },
    { date: '2026-03-28', distanceKm: 7, durationMin: 37, notes: 'Tempo with the club', categoryId: 3, userId: 1 },

    // April 2026
    { date: '2026-04-01', distanceKm: 5, durationMin: 30, notes: 'Easy start to the week', categoryId: 1, userId: 1 },
    { date: '2026-04-03', distanceKm: 8, durationMin: 41, notes: '8x400m hill sprints', categoryId: 4, userId: 1 },
    { date: '2026-04-05', distanceKm: 15, durationMin: 90, notes: 'Long run along the canal', categoryId: 2, userId: 1 },
    { date: '2026-04-07', distanceKm: 5, durationMin: 31, notes: 'Easy evening run', categoryId: 1, userId: 1 },
    { date: '2026-04-09', distanceKm: 8, durationMin: 46, notes: 'Tempo effort', categoryId: 3, userId: 1 },
    { date: '2026-04-11', distanceKm: 14, durationMin: 85, notes: 'Long run', categoryId: 2, userId: 1 },
    { date: '2026-04-14', distanceKm: 5, durationMin: 29, notes: 'Easy – legs fresh', categoryId: 1, userId: 1 },
    { date: '2026-04-16', distanceKm: 9, durationMin: 44, notes: '5x1km @ threshold', categoryId: 4, userId: 1 },
    { date: '2026-04-18', distanceKm: 6, durationMin: 35, notes: 'Chill Saturday jog', categoryId: 1, userId: 1 },
  ]);

  // ── Runs – Conor (userId: 2) ───────────────────────────
  await db.insert(runs).values([
    // January
    { date: '2026-01-06', distanceKm: 4, durationMin: 28, notes: 'Getting back into it', categoryId: 1, userId: 2 },
    { date: '2026-01-10', distanceKm: 5, durationMin: 34, notes: 'Slow and steady', categoryId: 1, userId: 2 },
    { date: '2026-01-15', distanceKm: 6, durationMin: 40, notes: 'Pushed the pace a bit', categoryId: 3, userId: 2 },
    { date: '2026-01-20', distanceKm: 8, durationMin: 55, notes: 'Longest run in months', categoryId: 2, userId: 2 },
    { date: '2026-01-25', distanceKm: 5, durationMin: 33, notes: 'Phoenix Park loop', categoryId: 1, userId: 2 },

    // February
    { date: '2026-02-02', distanceKm: 5, durationMin: 32, notes: 'Morning run before work', categoryId: 1, userId: 2 },
    { date: '2026-02-08', distanceKm: 10, durationMin: 65, notes: 'Double digits!', categoryId: 2, userId: 2 },
    { date: '2026-02-12', distanceKm: 5, durationMin: 30, notes: 'Treadmill – too icy outside', categoryId: 1, userId: 2 },
    { date: '2026-02-16', distanceKm: 5, durationMin: 31, notes: 'Parkrun – 30:22', categoryId: 5, userId: 2 },
    { date: '2026-02-20', distanceKm: 6, durationMin: 38, notes: 'Easy Friday run', categoryId: 1, userId: 2 },
    { date: '2026-02-24', distanceKm: 7, durationMin: 42, notes: 'Tempo session with Ruth', categoryId: 3, userId: 2 },

    // March
    { date: '2026-03-03', distanceKm: 5, durationMin: 31, notes: 'Quick lunchtime run', categoryId: 1, userId: 2 },
    { date: '2026-03-07', distanceKm: 12, durationMin: 78, notes: 'Long run – new route through Howth', categoryId: 2, userId: 2 },
    { date: '2026-03-11', distanceKm: 6, durationMin: 36, notes: '6x400m intervals', categoryId: 4, userId: 2 },
    { date: '2026-03-15', distanceKm: 10, durationMin: 57, notes: '10k race – PB 56:48!', categoryId: 5, userId: 2 },
    { date: '2026-03-19', distanceKm: 5, durationMin: 35, notes: 'Recovery jog', categoryId: 1, userId: 2 },
    { date: '2026-03-23', distanceKm: 13, durationMin: 82, notes: 'Longest run yet', categoryId: 2, userId: 2 },
    { date: '2026-03-27', distanceKm: 7, durationMin: 39, notes: 'Tempo – felt great', categoryId: 3, userId: 2 },

    // April
    { date: '2026-04-02', distanceKm: 5, durationMin: 30, notes: 'Easy run with the dog', categoryId: 1, userId: 2 },
    { date: '2026-04-06', distanceKm: 14, durationMin: 88, notes: 'Half marathon training long run', categoryId: 2, userId: 2 },
    { date: '2026-04-10', distanceKm: 8, durationMin: 42, notes: '4x1km @ 4:30', categoryId: 4, userId: 2 },
    { date: '2026-04-13', distanceKm: 5, durationMin: 31, notes: 'Easy morning spin', categoryId: 1, userId: 2 },
    { date: '2026-04-17', distanceKm: 7, durationMin: 38, notes: 'Tempo Friday', categoryId: 3, userId: 2 },
  ]);

  // ── Runs – Saoirse (userId: 3) ─────────────────────────
  await db.insert(runs).values([
    // February (just started running)
    { date: '2026-02-05', distanceKm: 3, durationMin: 24, notes: 'First run ever! Walk/run intervals', categoryId: 1, userId: 3 },
    { date: '2026-02-09', distanceKm: 3, durationMin: 22, notes: 'Less walking this time', categoryId: 1, userId: 3 },
    { date: '2026-02-14', distanceKm: 3.5, durationMin: 23, notes: 'Valentines day run', categoryId: 1, userId: 3 },
    { date: '2026-02-19', distanceKm: 4, durationMin: 28, notes: 'Managed 4k without stopping!', categoryId: 1, userId: 3 },
    { date: '2026-02-23', distanceKm: 4, durationMin: 27, notes: 'Getting easier', categoryId: 1, userId: 3 },

    // March
    { date: '2026-03-02', distanceKm: 5, durationMin: 35, notes: 'First 5k! Buzzing!', categoryId: 1, userId: 3 },
    { date: '2026-03-06', distanceKm: 4, durationMin: 27, notes: 'Easy Friday run', categoryId: 1, userId: 3 },
    { date: '2026-03-10', distanceKm: 5, durationMin: 33, notes: 'Getting faster', categoryId: 1, userId: 3 },
    { date: '2026-03-14', distanceKm: 5, durationMin: 34, notes: 'Joined the running club', categoryId: 1, userId: 3 },
    { date: '2026-03-17', distanceKm: 5, durationMin: 32, notes: 'St Patricks Day parkrun – 31:50', categoryId: 5, userId: 3 },
    { date: '2026-03-21', distanceKm: 7, durationMin: 48, notes: 'First run over 5k!', categoryId: 2, userId: 3 },
    { date: '2026-03-25', distanceKm: 5, durationMin: 31, notes: 'Easy midweek', categoryId: 1, userId: 3 },
    { date: '2026-03-29', distanceKm: 8, durationMin: 54, notes: 'Longest run – loved it', categoryId: 2, userId: 3 },

    // April
    { date: '2026-04-02', distanceKm: 5, durationMin: 30, notes: 'Sub-30 5k!!', categoryId: 1, userId: 3 },
    { date: '2026-04-05', distanceKm: 5, durationMin: 33, notes: 'Tried a tempo run with the club', categoryId: 3, userId: 3 },
    { date: '2026-04-08', distanceKm: 5, durationMin: 31, notes: 'Easy evening', categoryId: 1, userId: 3 },
    { date: '2026-04-12', distanceKm: 10, durationMin: 68, notes: 'First 10k! Slow but finished', categoryId: 2, userId: 3 },
    { date: '2026-04-15', distanceKm: 5, durationMin: 29, notes: 'Another sub-30!', categoryId: 1, userId: 3 },
    { date: '2026-04-18', distanceKm: 6, durationMin: 36, notes: 'Easy Saturday morning', categoryId: 1, userId: 3 },
  ]);

  // ── Targets ────────────────────────────────────────────
  await db.insert(targets).values([
    // Ruth – experienced runner
    { period: 'weekly', metricType: 'distance', targetValue: 40, categoryId: null, userId: 1 },
    { period: 'weekly', metricType: 'runs', targetValue: 4, categoryId: null, userId: 1 },
    { period: 'monthly', metricType: 'distance', targetValue: 160, categoryId: null, userId: 1 },
    { period: 'weekly', metricType: 'runs', targetValue: 1, categoryId: 2, userId: 1 },

    // Conor – intermediate
    { period: 'weekly', metricType: 'distance', targetValue: 25, categoryId: null, userId: 2 },
    { period: 'weekly', metricType: 'runs', targetValue: 3, categoryId: null, userId: 2 },

    // Saoirse – beginner, building consistency
    { period: 'weekly', metricType: 'runs', targetValue: 3, categoryId: null, userId: 3 },
    { period: 'weekly', metricType: 'distance', targetValue: 15, categoryId: null, userId: 3 },
  ]);
}