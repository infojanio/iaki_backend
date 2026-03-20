import { FastifyInstance } from "fastify";
import { createPlan } from "./create-plan";
import { listPlans } from "./list-plans";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function planRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/plans",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    createPlan,
  );

  app.get(
    "/plans",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    listPlans,
  );
}
