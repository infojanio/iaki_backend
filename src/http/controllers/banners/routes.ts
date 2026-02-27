import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "../banners/create";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listBanners } from "./listBanners";
import { getBanner } from "./get-banner";
import { updateBanner } from "./update-banner";
import { deleteBanner } from "./delete-banner";
import { getBannersByStoreController } from "./get-banners-by-store";
import { getBannersByCityController } from "./get-banners-by-city";

export async function bannersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // leitura (ambos podem ver)
  app.get("/banners", listBanners);
  app.get("/banners/:bannerId", getBanner);
  app.get("/banners/store/:storeId", getBannersByStoreController);
  app.get("/banners/city/:cityId", getBannersByCityController);

  // modificação (somente SUPER_ADMIN)
  app.post(
    "/banners",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    create,
  );

  app.patch(
    "/banners/:bannerId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    updateBanner,
  );

  app.delete(
    "/banners/:bannerId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    deleteBanner,
  );
}
