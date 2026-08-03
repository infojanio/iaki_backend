import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listRewardsByCity } from "./list-rewards-by-city";

export async function rewardsRoutes(app: FastifyInstance) {
  /*
   * Todas as rotas deste arquivo exigem login.
   * Isso funciona para a Home, pois ela está
   * dentro da área autenticada do aplicativo.
   */
  app.addHook("onRequest", verifyJWT);

  /*
   * Catálogo de brindes disponíveis na cidade.
   * Não exige ADMIN.
   */
  app.get("/rewards/city/:cityId", listRewardsByCity);
}
