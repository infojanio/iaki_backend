import { FastifyInstance } from "fastify";

import { getDashboardSummary } from "./get-dashboard-summary";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/dashboard/summary",
    {
      onRequest: [verifyUserRole("SUPER_ADMIN", "ADMIN")],
    },
    getDashboardSummary,
  );
}
