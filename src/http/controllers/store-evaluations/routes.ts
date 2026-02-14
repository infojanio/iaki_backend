import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { createStoreEvaluation } from "./store-evaluations";

export async function storeEvaluationsRoutes(app: FastifyInstance) {
  app.post(
    "/stores/:storeId/evaluations",
    {
      onRequest: [verifyJWT],
    },
    createStoreEvaluation,
  );
}
