import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createGoalCompletionRoute } from "./routes/createCompletions";
import { createGoalRoute } from "./routes/createGoal";
import { getWeekSummaryRoute } from "./routes/getWeekSummary";
import { listGoalsCompletionsRoute } from "./routes/listGoalsCompletions";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server
  .register(fastifyCors, {
    origin: '*',
  })

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(createGoalRoute);
server.register(createGoalCompletionRoute);
server.register(listGoalsCompletionsRoute);
server.register(getWeekSummaryRoute);

server
  .listen({ port: 3333 })
  .then(() => console.log("HTTP Server running on http://localhost:3333"));
