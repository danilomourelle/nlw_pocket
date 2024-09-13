import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { goalsProgress } from "../../modules/getGoalsProgress";

export const listGoalsCompletionsRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.get("/goal/progress", async () => {
    const response = await goalsProgress();

    return response;
  });
};
