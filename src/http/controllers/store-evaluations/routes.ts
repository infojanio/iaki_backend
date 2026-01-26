import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { createStoreEvaluationController } from "./store-evaluations-controller";

export async function storeEvaluationsRoutes(app: FastifyInstance) {
  app.post(
    "/stores/:storeId/evaluations",
    {
      onRequest: [verifyJWT],
    },
    createStoreEvaluationController,
  );
}
