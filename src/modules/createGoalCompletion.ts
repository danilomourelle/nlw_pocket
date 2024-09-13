import dayjs from "dayjs";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { goalCompletions, goals } from "../../database/schema";
import { db } from "../database";

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalCompletionsCount = db.$with("goal_completions_count").as(
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

  const result = await db
    .with(goalCompletionsCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionsCount:
        sql`COALESCE(${goalCompletionsCount.completionsCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalCompletionsCount, eq(goals.id, goalCompletionsCount.goalId))
    .where(eq(goals.id, goalId))
    .limit(1);

  const { desiredWeeklyFrequency, completionsCount } = result[0];

  if (completionsCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed");
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning();
  const goalCompletion = insertResult[0];

  return { goalCompletion };
}
