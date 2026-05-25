import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../categories/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listCategories } from "./listCategories";
import { getCategory } from "./get-category";
import { updateCategory } from "./update-category";
import { listCategoriesByStore } from "./list-categories-by-store";

export async function categoriesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/categories", listCategories);
  app.get("/categories/:categoryId", getCategory);
  app.patch(
    "/categories/:categoryId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    updateCategory,
  );

  app.get(
    "/categories/me",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN", "ADMIN")],
    },
    listCategoriesByStore,
  );

  app.post(
    //    '/stores/${storeId}/subcategories/${subcategoryId}/products',
    "/categories",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    create,
  );

  //app.post('/stores/:storeId/orders', { onRequest: [verifyJWT] }, create)
}
