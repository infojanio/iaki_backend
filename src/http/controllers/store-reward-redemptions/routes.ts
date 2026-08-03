import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { approveStoreRewardRedemption } from "./approve-store-reward-redemption";
import { listPendingStoreRewardRedemptions } from "./list-pending-store-reward-redemptions";
import { listConfirmedStoreRewardRedemptions } from "./list-confirmed-store-reward-redemptions";
import { getMyRewardRedemption } from "./get-my-reward-redemption";

export async function storeRewardRedemptionsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get(
    "/stores/rewards/redemptions/pending",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    listPendingStoreRewardRedemptions,
  );

  /*
   * Cliente consulta um resgate específico.
   * A consulta é limitada ao próprio userId.
   */
  app.get("/stores/rewards/redemptions/:redemptionId", getMyRewardRedemption);

  app.get(
    "/stores/rewards/redemptions/history",

    listConfirmedStoreRewardRedemptions,
  );

  app.patch(
    "/stores/rewards/redemptions/:redemptionId/approve",
    {
      onRequest: [verifyUserRole("ADMIN")],
    },
    approveStoreRewardRedemption,
  );
}
