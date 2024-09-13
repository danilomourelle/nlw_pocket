import { integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const databaseSchema = pgSchema("pocket");

export const goals = databaseSchema.table("goals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  desiredWeeklyFrequency: integer("desired_weekly_frequency").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const goalCompletions = databaseSchema.table("goal_completions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text("goal_id")
    .references(() => goals.id)
    .notNull(),
  createdAd: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
