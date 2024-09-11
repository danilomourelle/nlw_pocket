import fastify from "fastify";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createGoalCompletionRoute } from "./routes/create-completions";
import { createGoalRoute } from "./routes/create-goal";
import { listGoalsCompletionsRoute } from "./routes/list-goals-completions";
import { getWeekSummaryRoute } from "./routes/get-week-summary";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(createGoalRoute);
server.register(createGoalCompletionRoute);
server.register(listGoalsCompletionsRoute);
server.register(getWeekSummaryRoute);

server
  .listen({ port: 3333 })
  .then(() => console.log("HTTP Server running on http://localhost:3333"));
