import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { createStoreReward } from "./create-store-reward";

import { listStoreRewards } from "./list-store-reward";

import { getStoreReward } from "./get-store-reward";

import { updateStoreReward } from "./update-store-reward";

import { deleteStoreReward } from "./delete-store-reward";
import { listMyPendingRedemptions } from "./list-pending-redemptions";

export async function storeRewardsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/stores/rewards/me",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    listStoreRewards,
  );

  app.get("/stores/:storeId/rewards/redemptions/me", listMyPendingRedemptions);

  app.post(
    "/stores/rewards",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    createStoreReward,
  );

  app.get(
    "/stores/rewards/:rewardId",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    getStoreReward,
  );

  app.patch(
    "/stores/rewards/:rewardId",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    updateStoreReward,
  );

  app.delete(
    "/stores/rewards/:rewardId",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    deleteStoreReward,
  );
}
