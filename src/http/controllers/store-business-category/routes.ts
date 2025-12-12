import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listStoreBusinessCategoriesController } from "./list-store-business-categories";
import { getStoreBusinessCategoryController } from "./get-store-business-category";
import { createStoreBusinessCategoryController } from "./create-store-business-category";
import { deleteStoreBusinessCategoryController } from "./delete-store-business-category";

export async function storeBusinessCategoryRoutes(app: FastifyInstance) {
  // Todas as rotas exigem usuário autenticado
  app.addHook("onRequest", verifyJWT);

  // (ADMIN / DEBUG) – listar todas as relações
  app.get(
    "/store-business-categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    listStoreBusinessCategoriesController,
  );

  // (ADMIN) – obter uma relação específica
  app.get(
    "/store-business-categories/:id",
    { onRequest: [verifyUserRole("ADMIN")] },
    getStoreBusinessCategoryController,
  );

  // (ADMIN) – criar vínculo loja ↔ categoria
  app.post(
    "/store-business-categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    createStoreBusinessCategoryController,
  );

  // (ADMIN) – remover vínculo loja ↔ categoria
  app.delete(
    "/store-business-categories/:id",
    { onRequest: [verifyUserRole("ADMIN")] },
    deleteStoreBusinessCategoryController,
  );
}
