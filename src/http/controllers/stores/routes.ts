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
   * 🔓 ROTAS AUTENTICADAS
   * ==============================
   */

  app.get("/stores/search", { onRequest: [verifyJWT] }, search);

  app.get("/stores/nearby", { onRequest: [verifyJWT] }, nearby);

  app.get("/stores", { onRequest: [verifyJWT] }, listStores);

  app.get(
    "/stores/business/:categoryId",
    { onRequest: [verifyJWT] },
    listStoreByBusinessCategoriesController,
  );

  app.get(
    "/stores/city/:cityId/category/:categoryId",
    { onRequest: [verifyJWT] },
    listStoresByCityAndCategory,
  );

  app.get("/stores/city/:cityId", { onRequest: [verifyJWT] }, listStoresByCity);

  app.get(
    "/stores/premium/city/:cityId",
    { onRequest: [verifyJWT] },
    listPremiumStoresByCity,
  );

  app.get(
    "/stores/:storeId/categories",
    { onRequest: [verifyJWT] },
    getStoreCategoriesController,
  );

  app.get("/stores/active", { onRequest: [verifyJWT] }, listStoresActive);

  app.get("/stores/:storeId", { onRequest: [verifyJWT] }, FetchStoreById);

  /**
   * ==============================
   * 🔐 ROTAS ADMINISTRATIVAS
   * ==============================
   */
  app.post(
    "/stores",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    create,
  );

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
