import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../modules/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.get("/summary", async () => {
    const response = await getWeekSummary();

    return response;
  });
};
