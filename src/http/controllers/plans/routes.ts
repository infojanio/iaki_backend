import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { createPlan } from "./create-plan";
import { listPlans } from "./list-plans";
import { updatePlan } from "./update-plan";
import { deletePlan } from "./delete-plan";
import { getPlanById } from "./get-plan-by-id";

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
      preHandler: [verifyUserRole("SUPER_ADMIN", "ADMIN")],
    },
    listPlans,
  );

  app.get(
    "/plans/:id",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    getPlanById,
  );

  app.put(
    "/plans/:id",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    updatePlan,
  );

  app.delete(
    "/plans/:id",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    deletePlan,
  );
}
