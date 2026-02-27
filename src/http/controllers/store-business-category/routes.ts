import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listStoreByBusinessCategoriesController } from "./list-store-by-business-categories";
import { getStoreBusinessCategoryController } from "./get-store-business-category";
import { createStoreBusinessCategoryController } from "./create-store-business-category";
import { deleteStoreBusinessCategoryController } from "./delete-store-business-category";
import { LinkStoreToBusinessCategoryController } from "./link-store-to-business-category";

export async function storeBusinessCategoryRoutes(app: FastifyInstance) {
  // Todas as rotas exigem usuário autenticado
  app.addHook("onRequest", verifyJWT);
 
  // Listar todas as lojas por categorias de negócio (usado na Home)
  app.get(
    "/stores-business-categories/category/:categoryId",
    listStoreByBusinessCategoriesController,
  );

  // (ADMIN / DEBUG) – listar todas as relações
  app.get(
    "/store-business-categories",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    listStoreByBusinessCategoriesController,
  );


  // (ADMIN) – obter uma relação específica
  app.get(
    "/store-business-categories/:categoryId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    getStoreBusinessCategoryController,
  );

  // Vincular BusinessCategory a City (ADMIN)
  app.post(
    "/store-business-categories/link-category",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    LinkStoreToBusinessCategoryController,
  );

  // (ADMIN) – criar vínculo loja ↔ categoria
  app.post(
    "/store-business-categories",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    createStoreBusinessCategoryController,
  );

  // (ADMIN) – remover vínculo loja ↔ categoria
  app.delete(
    "/store-business-categories/:id",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    deleteStoreBusinessCategoryController,
  );
}
