import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createGoalCompletion } from "../../modules/createGoalCompletion";

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/goals-completions",
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request) => {
      const { goalId } = request.body;
  
      const response = await createGoalCompletion({
        goalId,
      });
  
      return response;
    }
  );
};
