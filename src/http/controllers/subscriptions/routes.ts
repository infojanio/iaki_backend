import { FastifyInstance } from "fastify";
import { subscribeStoreToPlan } from "../subscriptions/subscribe-store-to-plan";
import { getStoreSubscription } from "../subscriptions/get-store-subscription";
import { validateStoreLimits } from "../subscriptions/validate-store-limits";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { listSubscriptions } from "./list-subscriptions";
import { changeStorePlan } from "../plans/change-plan";
import { validateDowngradePlanController } from "../plans/validate-downgrade-plan";
import { updateSubscriptionEndDate } from "./update-subscription";

export async function subscriptionRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/subscriptions",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    subscribeStoreToPlan,
  );

  app.post(
    "/stores/me/subscription/change-plan",
    {
      preHandler: [verifyUserRole("ADMIN")],
    },
    changeStorePlan,
  );

  app.post(
    "/subscriptions/validate-downgrade",
    {
      onRequest: [verifyJWT, verifyUserRole("ADMIN")],
    },
    validateDowngradePlanController,
  );

  app.get(
    "/stores/me/subscription",
    {
      preHandler: [verifyUserRole("ADMIN")],
    },
    getStoreSubscription,
  );

  app.patch(
    "/subscriptions/:subscriptionId/end-date",
    { onRequest: [verifyUserRole("ADMIN")] },
    updateSubscriptionEndDate,
  );

  app.get(
    "/subscriptions",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    listSubscriptions,
  );

  app.get(
    "/stores/me/subscription/limits/:resource",
    {
      preHandler: [verifyUserRole("ADMIN", "SUPER_ADMIN")],
    },
    validateStoreLimits,
  );
}
