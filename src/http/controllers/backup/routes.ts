import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { backupDatabase } from "./backup-database";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function userRoutes(app: FastifyInstance) {
  app.post(
    "/admin/backup",
    { onRequest: [verifyJWT, verifyUserRole("ADMIN")] },
    backupDatabase,
  );
}
// /iaki_backend-api-iaki-pg-1
