import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listStoreByCategoriesController } from "./list-store-by-categories";
import { getStoreCategoryController } from "./get-store-category";
import { createStoreCategoryController } from "./create-store-category";
import { deleteStoreCategoryController } from "./delete-store-category";
import { LinkStoreToCategoryController } from "./link-store-to-category";
import { listMyStoreCategoriesController } from "./list-my-store-categories";
import { updateMyStoreCategoriesController } from "./update-my-store-categories";

export async function storeCategoryRoutes(app: FastifyInstance) {
  // Todas as rotas exigem usuário autenticado
  app.addHook("onRequest", verifyJWT);

  // 🔹 listar categorias da minha loja
  app.get(
    "/stores/me/categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    listMyStoreCategoriesController,
  );

  // 🔹 atualizar TODAS as categorias da loja (REPLACE)
  app.put(
    "/stores/me/categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateMyStoreCategoriesController,
  );

  // (ADMIN / DEBUG) – listar todas as relações
  app.get("/store-categories", listStoreByCategoriesController);

  // Listar todas as lojas por categorias de negócio (usado na Home)
  app.get(
    "/stores-categories/category/:categoryId",
    listStoreByCategoriesController,
  );

  // (ADMIN) – obter uma relação específica
  app.get(
    "/stores-categories/:categoryId",
    { onRequest: [verifyUserRole("ADMIN")] },
    getStoreCategoryController,
  );

  // Vincular Category a Store (ADMIN)
  app.post(
    "/store-categories/link-category",
    { onRequest: [verifyUserRole("ADMIN")] },
    LinkStoreToCategoryController,
  );

  // (ADMIN) – criar vínculo loja ↔ categoria
  app.post(
    "/store-categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    createStoreCategoryController,
  );

  // (ADMIN) – remover vínculo loja ↔ categoria
  app.delete(
    "/store-categories/:id",
    { onRequest: [verifyUserRole("ADMIN")] },
    deleteStoreCategoryController,
  );
}
