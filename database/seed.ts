import { client, db } from "../src/database";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Beber água", desiredWeeklyFrequency: 1 },
      { title: "Ler", desiredWeeklyFrequency: 2 },
      { title: "Estudar", desiredWeeklyFrequency: 3 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");
  const randomSeconds = () => Math.floor(Math.random() * 60 * 60 * 24 * 7);

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAd: startOfWeek.add(randomSeconds(), "seconds").toDate(),
    },
    {
      goalId: result[1].id,
      createdAd: startOfWeek.add(randomSeconds(), "seconds").toDate(),
    },
    {
      goalId: result[2].id,
      createdAd: startOfWeek.add(randomSeconds(), "seconds").toDate(),
    },
  ]);
}

seed().finally(() => client.end());
