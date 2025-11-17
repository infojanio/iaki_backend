import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listStores } from "./listStores";
import { listStoresActive } from "./listStoresActive";
import { toggleStatus } from "./toggleStore";

export async function storesRoutes(app: FastifyInstance) {
  // 🔓 Permite acesso público às rotas de busca e lojas próximas
  app.get("/stores/search", search);
  app.get("/stores/nearby", nearby);
  app.get("/stores", listStores);
  app.get("/stores/active", listStoresActive);
  //app.post('/stores', create)

  // 🔐 As demais rotas exigem autenticação
  app.addHook("onRequest", verifyJWT);
  app.post("/stores", { onRequest: [verifyUserRole("ADMIN")] }, create);
  app.patch(
    "/stores/:storeId/toggle-status",
    { onRequest: [verifyUserRole("ADMIN")] },
    toggleStatus
  );
}
