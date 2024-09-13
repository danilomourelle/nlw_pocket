import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { completeGoal } from "../../modules/completeGoal";

export const completeGoalRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/goal/complete",
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request) => {
      const { goalId } = request.body;

      const response = await completeGoal({
        goalId,
      });

      return response;
    }
  );
};
