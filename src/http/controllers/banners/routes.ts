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
import { listPremiumBannersByCity } from "./list-premium-banners-by-city";

export async function bannersRoutes(app: FastifyInstance) {
  // =============================
  // PUBLICAS
  // =============================

  app.get("/banners", listBanners);

  app.get("/banners/:bannerId", getBanner);

  app.get("/banners/city/:cityId", getBannersByCityController);

  // 🔥 NOVA
  app.get("/stores/:storeId/banners", getBannersByStoreController);

  app.get("/banners/premium/city/:cityId", listPremiumBannersByCity);

  // =============================
  // PRIVADAS (ADMIN)
  // =============================

  app.post(
    "/banners",
    {
      onRequest: [
        verifyJWT,
        verifyUserRole("ADMIN"),
        checkStoreLimit("banners"),
      ],
    },
    create,
  );

  app.patch(
    "/banners/:bannerId",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    updateBanner,
  );

  app.delete(
    "/banners/:bannerId",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    deleteBanner,
  );

  app.get(
    "/banners/me",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    getBannersByStoreController,
  );
}
