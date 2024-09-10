import dayjs from "dayjs";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { goalCompletions, goals } from "../../database/schema";
import { db } from "../database";

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalsCreatedBeforeLastDayOfWeek = db
    .$with("goals_created_before_last_day_of_week")
    .as(
      db
        .select({
          id: goals.id,
          title: goals.title,
          desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
          createdAt: goals.createdAt,
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    );

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
          gte(goalCompletions.createdAd, firstDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreatedBeforeLastDayOfWeek, goalCompletionsCount)
    .select({
      id: goalsCreatedBeforeLastDayOfWeek.id,
      title: goalsCreatedBeforeLastDayOfWeek.title,
      desiredWeeklyFrequency:
        goalsCreatedBeforeLastDayOfWeek.desiredWeeklyFrequency,
      completionsCount:
        sql`COALESCE(${goalCompletionsCount.completionsCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreatedBeforeLastDayOfWeek)
    .leftJoin(
      goalCompletionsCount,
      eq(goalsCreatedBeforeLastDayOfWeek.id, goalCompletionsCount.goalId)
    )
    .orderBy(goalCompletionsCount.completionsCount);

  return { pendingGoals };
}
