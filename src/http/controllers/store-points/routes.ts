import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { getStorePoints } from "./get-store-points";
import { redeemStoreReward } from "./redeem-store-reward";

export async function storePointsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/stores/:storeId/points/me",
    { onRequest: [verifyJWT] },
    getStorePoints,
  );

  app.post(
    "/stores/:storeId/rewards/:rewardId/redeem",
    { onRequest: [verifyJWT] },
    redeemStoreReward,
  );
}
