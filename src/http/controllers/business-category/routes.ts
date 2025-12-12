import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { createBusinessCategoryController } from "./create-business-category";
import { deleteBusinessCategoryController } from "./delete-business-category";
import { getBusinessCategoryController } from "./get-business-category";
import { listBusinessCategoriesController } from "./list-business-categories";
import { searchBusinessCategoryController } from "./search-business-category";
import { updateBusinessCategoryController } from "./update-business-category";

export async function businessCategoriesRoutes(app: FastifyInstance) {
  // Todas exigem usuário autenticado
  app.addHook("onRequest", verifyJWT);

  // Listar todas as categorias (usado na Home e Admin)
  app.get("/business-categories", listBusinessCategoriesController);

  // Buscar categorias por nome (?q=farm)
  app.get("/business-categories/search", searchBusinessCategoryController);

  // Buscar categoria por ID
  app.get("/business-categories/:id", getBusinessCategoryController);

  // Criar categoria (ADMIN)
  app.post(
    "/business-categories",
    { onRequest: [verifyUserRole("ADMIN")] },
    createBusinessCategoryController,
  );

  // Atualizar categoria (ADMIN)
  app.patch(
    "/business-categories/:id",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateBusinessCategoryController,
  );

  // Deletar categoria (ADMIN)
  app.delete(
    "/business-categories/:id",
    { onRequest: [verifyUserRole("ADMIN")] },
    deleteBusinessCategoryController,
  );
}
