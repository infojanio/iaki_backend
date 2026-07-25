import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { listStores } from "./listStores";
import { listStoresActive } from "./listStoresActive";
import { toggleStatus } from "./toggleStore";
import { listStoresByCityAndCategory } from "./list-stores-by-city-and-category";
import { listStoreByBusinessCategoriesController } from "../store-business-category/list-store-by-business-categories";
import { listStoresByCity } from "./list-stores-by-city";
import { FetchStoreById } from "./fetch-store-by-id";
import { getStoreCategoriesController } from "./get-store-categories";
import { updateStore } from "./update";
import { listPremiumStoresByCity } from "./list-premium-stores-by-city";

export async function storesRoutes(app: FastifyInstance) {
  /**
   * ==============================
   * 🔓 ROTAS PÚBLICAS (APP)
   * ==============================
   */
  // Criar loja → LIBERADO cadastro pelo site iaki.com.br sem logar no painel
  app.post("/stores", create);

  app.get("/stores/search", search);
  app.get("/stores/nearby", nearby);
  app.get("/stores", listStores);

  // Listar lojas por BusinessCategory
  app.get(
    "/stores/business/:categoryId",
    listStoreByBusinessCategoriesController,
  );

  // Lojas por cidade + categoria
  app.get(
    "/stores/city/:cityId/category/:categoryId",
    listStoresByCityAndCategory,
  );

  // Lojas por cidade
  app.get("/stores/city/:cityId", listStoresByCity);

  //listar lojas plano: Premium
  app.get("/stores/premium/city/:cityId", listPremiumStoresByCity);

  // Categorias internas da loja
  app.get("/stores/:storeId/categories", getStoreCategoriesController);

  // Lojas ativas
  app.get("/stores/active", listStoresActive);

  // Buscar loja específica
  app.get("/stores/:storeId", FetchStoreById);
  /**
   * ==============================
   * 🔐 ROTAS ADMINISTRATIVAS
   * ==============================
   */

  // Todas abaixo exigem JWT
  app.addHook("onRequest", verifyJWT);

  app.patch(
    "/stores/:storeId",
    { onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")] },
    updateStore,
  );

  // Ativar / Desativar loja → SUPER_ADMIN
  app.patch(
    "/stores/:storeId/toggle-status",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    toggleStatus,
  );
}
