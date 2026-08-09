import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { generateStoreAuditReport } from "./generate-store-audit-report";

export async function reportsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/reports/store-audit",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    generateStoreAuditReport,
  );
}
