import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createGoal } from "../../modules/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (server) => {
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
};
