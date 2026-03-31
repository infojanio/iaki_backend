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
import { checkStoreLimit } from "@/http/middlewares/check-store-limit";

export async function bannersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // leitura (ambos podem ver)
  app.get("/banners", listBanners);
  app.get("/banners/:bannerId", getBanner);

  app.get(
    "/banners/me",
    { onRequest: [verifyUserRole("ADMIN")] },
    getBannersByStoreController,
  );

  app.get("/banners/city/:cityId", getBannersByCityController);

  // modificação (somente SUPER_ADMIN)
  app.post(
    "/banners",
    { onRequest: [verifyUserRole("ADMIN"), checkStoreLimit("banners")] },
    create,
  );

  app.patch(
    "/banners/:bannerId",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateBanner,
  );

  app.delete(
    "/banners/:bannerId",
    { onRequest: [verifyUserRole("ADMIN")] },
    deleteBanner,
  );
}
