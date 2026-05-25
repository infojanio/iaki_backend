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

export async function reelsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/reels", listReels);
  app.get("/reels/:reelId", getReel);

  app.get(
    "/reels/me",
    { onRequest: [verifyUserRole("ADMIN", "SUPER_ADMIN")] },
    getReelsByStoreController,
  );

  app.patch(
    "/reels/:reelId",
    { onRequest: [verifyUserRole("SUPER_ADMIN", "ADMIN")] },
    updateReel,
  );
  app.delete(
    "/reels/:reelId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    deleteReel,
  );

  app.post(
    "/reels",
    { onRequest: [verifyUserRole("SUPER_ADMIN", "ADMIN")] },
    create,
  );
}
