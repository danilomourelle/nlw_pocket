import dayjs from "dayjs";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { goalCompletions, goals } from "../../database/schema";
import { db } from "../database";

interface CompleteGoalRequest {
  goalId: string;
}

export async function completeGoal({ goalId }: CompleteGoalRequest) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalCompletionCount = db.$with("goal_completions_count").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionsCount: count(goalCompletions.goalId).as("completionsCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          lte(goalCompletions.createdAd, lastDayOfWeek),
          gte(goalCompletions.createdAd, firstDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const goalCompletionAndDesired = await db
    .with(goalCompletionCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionsCount:
        sql`COALESCE(${goalCompletionCount.completionsCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalCompletionCount, eq(goals.id, goalCompletionCount.goalId))
    .where(eq(goals.id, goalId))
    .limit(1);

  if (goalCompletionAndDesired.length === 0) {
    throw new Error("Goal not found");
  }

  const { desiredWeeklyFrequency, completionsCount } =
    goalCompletionAndDesired[0];

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed");
  }

  const result = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning();

  return result[0];
}
