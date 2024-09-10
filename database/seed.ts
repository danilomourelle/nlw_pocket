import { client, db } from "../src/database";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Beber água", desiredWeeklyFrequency: 5 },
      { title: "Estudar", desiredWeeklyFrequency: 3 },
      { title: "Ler", desiredWeeklyFrequency: 2 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAd: startOfWeek.toDate() },
    { goalId: result[1].id, createdAd: startOfWeek.add(1, "day").toDate() },
    { goalId: result[2].id, createdAd: startOfWeek.toDate() },
    { goalId: result[2].id, createdAd: startOfWeek.add(2, "day").toDate() },
  ]);
}

seed().finally(() => client.end());
