import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { createStoreReward } from "./create-store-reward";
import { listMyPendingRedemptions } from "./list-pending-redemptions";

export async function storeRewardsRoutes(app: FastifyInstance) {
  app.post(
    "/stores/rewards",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    createStoreReward,
  );

  app.get(
    "/stores/:storeId/rewards/redemptions/me",
    { onRequest: [verifyJWT] },
    listMyPendingRedemptions,
  );
}
