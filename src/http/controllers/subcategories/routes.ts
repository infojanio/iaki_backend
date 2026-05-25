import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { create } from "../subcategories/create";
import { fetchSubCategoriesByCategory } from "./fetch-subcategories-by-category";
import { listSubCategories } from "./listSubCategories";
import { updateSubcategory } from "./update-subcategory";
import { getSubcategory } from "./get-subcategory";
import { listSubcategoriesByStore } from "./list-subcategories-by-store";

export async function subcategoriesRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // 🔎 Consulta
  app.get("/subcategories", listSubCategories);
  app.get("/subcategories/:subcategoryId", getSubcategory);
  app.get("/subcategories/category", fetchSubCategoriesByCategory);

  // 🔐 Operação da loja → ADMIN
  app.post(
    "/subcategories",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    create,
  );

  app.get(
    "/subcategories/me",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN", "ADMIN")],
    },
    listSubcategoriesByStore,
  );

  app.patch(
    "/subcategories/:subcategoryId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    updateSubcategory,
  );
}
