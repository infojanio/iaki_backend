import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { getStorePointsByStore } from "./get-store-points-by-store";
import { redeemStoreReward } from "./redeem-store-reward";
import { getStoreRewardsByStore } from "./get-store-rewards-by-store";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { validateStoreRewardRedemption } from "./validate-store-reward-redemption";

export async function storePointsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/stores/:storeId/points/me",
    { onRequest: [verifyJWT] },
    getStorePointsByStore,
  );

  app.get("/stores/:storeId/rewards", getStoreRewardsByStore);

  app.post(
    "/stores/rewards/validate/:redemptionId",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    validateStoreRewardRedemption,
  );

  app.post(
    "/stores/:storeId/rewards/:rewardId/redeem",
    { onRequest: [verifyJWT] },
    redeemStoreReward,
  );
}
