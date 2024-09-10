import fastify from "fastify";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import z from "zod";
import { createGoal } from "../modules/create-goal";
import { getWeekPendingGoals } from "../modules/get-week-pending-goals";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.get("/pending-goals", async () => {
  const response = await getWeekPendingGoals();

  return response;
});

server.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(0).max(7),
      }),
    },
  },
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body;

    const response = await createGoal({
      title,
      desiredWeeklyFrequency,
    });

    return response;
  }
);

server
  .listen({ port: 3333 })
  .then(() => console.log("HTTP Server running on http://localhost:3333"));
