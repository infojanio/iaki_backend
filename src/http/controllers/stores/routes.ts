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

export async function storesRoutes(app: FastifyInstance) {
  /**
   * ==============================
   * 🔓 ROTAS PÚBLICAS (APP)
   * ==============================
   */

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

  // Buscar loja específica
  app.get("/stores/:storeId", FetchStoreById);

  // Categorias internas da loja
  app.get("/stores/:storeId/categories", getStoreCategoriesController);

  // Lojas ativas
  app.get("/stores/active", listStoresActive);

  /**
   * ==============================
   * 🔐 ROTAS ADMINISTRATIVAS
   * ==============================
   */

  // Todas abaixo exigem JWT
  app.addHook("onRequest", verifyJWT);

  // Criar loja → SUPER_ADMIN
  app.post(
    "/stores",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    create,
  );

  // Ativar / Desativar loja → SUPER_ADMIN
  app.patch(
    "/stores/:storeId/toggle-status",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    toggleStatus,
  );
}