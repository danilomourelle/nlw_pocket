import fastify from "fastify";
import { createGoal } from "../modules/create-goal";
import z from "zod";

const server = fastify();

server.post("/goals", async (request) => {
	const bodySchema = z.object({
		title: z.string(),
		desiredWeeklyFrequency: z.number().int().min(0).max(7),
	});

	const { body } = request;
	const { title, desiredWeeklyFrequency } = bodySchema.parse(body);

	const response = await createGoal({
		title,
		desiredWeeklyFrequency,
	});

	return response;
});

server
	.listen({ port: 3333 })
	.then(() => console.log("HTTP Server running on http://localhost:3333"));
