import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  icon: text('icon'),
});

export const runs = sqliteTable('runs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  distanceKm: real('distance_km').notNull(),
  durationMin: integer('duration_min').notNull(),
  notes: text('notes'),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  period: text('period').notNull(),
  metricType: text('metric_type').notNull(),
  targetValue: real('target_value').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
});