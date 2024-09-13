import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { completeGoalRoute } from "./http/routes/completeGoal";
import { createGoalRoute } from "./http/routes/createGoal";
import { getWeekSummaryRoute } from "./http/routes/getWeekSummary";
import { listGoalsCompletionsRoute } from "./http/routes/listGoalsCompletions";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.register(fastifyCors, {
  origin: "*",
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(createGoalRoute);
server.register(completeGoalRoute);
server.register(listGoalsCompletionsRoute);
server.register(getWeekSummaryRoute);

server
  .listen({ port: 3333 })
  .then(() => console.log("HTTP Server running on http://localhost:3333"));
