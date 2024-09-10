import { integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const databaseSchema = pgSchema("pocket");

export const goals = databaseSchema.table("goals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  desiredWeeklyFrequency: integer("desired_weekly_frequency").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const goalCompletions = databaseSchema.table("goal_completions", {
  id: text("id").primaryKey(),
  goalId: text("goal_id")
    .references(() => goals.id)
    .notNull(),
  createdAd: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
