import { client, db } from "../src/database";
import { goalCompletions, goals } from "./schema";

async function seed() {
	await db.delete(goalCompletions);
	await db.delete(goals);

	const result = await db.insert(goals).values([
		{ title: "Beber água", desiredWeeklyFrequency: 5 },
		{ title: "Estudar", desiredWeeklyFrequency: 3 },
		{ title: "Ler", desiredWeeklyFrequency: 2 },
	]).returning();

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAd: new Date() },
    { goalId: result[1].id, createdAd: new Date() },
    { goalId: result[2].id, createdAd: new Date() },
  ]);
}

seed().finally(() => client.end());
