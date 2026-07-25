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
   * 🔓 ROTAS PÚBLICAS
   * ==============================
   */

  // Cadastro de loja pelo site, sem autenticação
  app.post("/stores", create);

  app.get("/stores/search", search);

  app.get("/stores/nearby", nearby);

  app.get("/stores", listStores);

  app.get(
    "/stores/business/:categoryId",
    listStoreByBusinessCategoriesController,
  );

  app.get(
    "/stores/city/:cityId/category/:categoryId",
    listStoresByCityAndCategory,
  );

  app.get("/stores/city/:cityId", listStoresByCity);

  app.get("/stores/premium/city/:cityId", listPremiumStoresByCity);

  app.get("/stores/:storeId/categories", getStoreCategoriesController);

  app.get("/stores/active", listStoresActive);

  app.get("/stores/:storeId", FetchStoreById);

  /**
   * ==============================
   * 🔐 ROTAS ADMINISTRATIVAS
   * ==============================
   */

  app.patch(
    "/stores/:storeId",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    updateStore,
  );

  app.patch(
    "/stores/:storeId/toggle-status",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    toggleStatus,
  );
}
