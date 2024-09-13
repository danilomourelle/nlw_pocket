import dayjs from "dayjs";
import { lte, and, gte, count, eq, sql, desc } from "drizzle-orm";
import { goals, goalCompletions } from "../../database/schema";
import { db } from "../database";

type GoalsPerDay = Record<
  string,
  {
    id: string;
    title: string;
    completedAt: string;
  }[]
>;

export async function getWeekSummary() {
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

  const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedAt: goalCompletions.createdAd,
        completedAtDate: sql`DATE(${goalCompletions.createdAd})`.as(
          "completedAtDate"
        ),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goalCompletions.goalId, goals.id))
      .orderBy(desc(goalCompletions.createdAd))
      .where(
        and(
          lte(goalCompletions.createdAd, lastDayOfWeek),
          gte(goalCompletions.createdAd, firstDayOfWeek)
        )
      )
  );

  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql /*sql*/`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id}, 
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
        )`.as("completions"),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  );

  const result = await db
    .with(
      goalsCreatedBeforeLastDayOfWeek,
      goalsCompletedInWeek,
      goalsCompletedByWeekDay
    )
    .select({
      completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
        Number
      ),
      total:
        sql`(SELECT SUM(${goalsCreatedBeforeLastDayOfWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedBeforeLastDayOfWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql<GoalsPerDay>`JSON_OBJECT_AGG(${goalsCompletedByWeekDay.completedAtDate}, ${goalsCompletedByWeekDay.completions})`,
    })
    .from(goalsCompletedByWeekDay);

  return result[0];
}
