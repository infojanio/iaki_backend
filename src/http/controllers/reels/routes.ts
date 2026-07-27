import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listReels } from "./listReels";
import { getReel } from "./get-reel";
import { updateReel } from "./update-reel";
import { deleteReel } from "./delete-reel";
import { create } from "./create";
import { checkStoreLimit } from "@/http/middlewares/check-store-limit";
import { getReelsByStoreController } from "./get-reels-by-store";
import { listPremiumReelsByCity } from "./list-premium-reels-by-city";

export async function reelsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/reels", listReels);
  app.get("/reels/:reelId", getReel);

  app.get("/reels/premium/city/:cityId", listPremiumReelsByCity);

  app.get(
    "/reels/me",
    { onRequest: [verifyUserRole("ADMIN")] },
    getReelsByStoreController,
  );

  app.patch(
    "/reels/:reelId",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateReel,
  );
  app.delete(
    "/reels/:reelId",
    { onRequest: [verifyUserRole("ADMIN")] },
    deleteReel,
  );

  app.post("/reels", { onRequest: [verifyUserRole("ADMIN")] }, create);
}
