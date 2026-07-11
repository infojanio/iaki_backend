import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { subscribeStoreToPlan } from "../subscriptions/subscribe-store-to-plan";
import { getStoreSubscription } from "../subscriptions/get-store-subscription";
import { validateStoreLimits } from "../subscriptions/validate-store-limits";

import { listSubscriptions } from "./list-subscriptions";
import { updateSubscriptionEndDate } from "./update-subscription";
import { cancelSubscription } from "./cancel-subscription";
import { reactiveSubscription } from "./reactive-subscription";
import { renewSubscription } from "./renew-subscription";

import { changeStorePlan } from "../plans/change-plan";
import { validateDowngradePlanController } from "../plans/validate-downgrade-plan";
import { createSubscription } from "./create-subscription";

export async function subscriptionRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  /*
  |--------------------------------------------------------------------------
  | SUPER ADMIN
  |--------------------------------------------------------------------------
  */

  app.post(
    "/subscription",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    createSubscription,
  );

  app.post(
    "/subscriptions",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    subscribeStoreToPlan,
  );

  app.get(
    "/subscriptions",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    listSubscriptions,
  );

  app.patch(
    "/subscriptions/:subscriptionId/renew",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    renewSubscription,
  );

  app.patch(
    "/subscriptions/:subscriptionId/end-date",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    updateSubscriptionEndDate,
  );

  app.patch(
    "/subscriptions/:subscriptionId/cancel",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    cancelSubscription,
  );

  app.patch(
    "/subscriptions/store/:storeId/reactivate",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    reactiveSubscription,
  );

  app.post(
    "/subscriptions/validate-downgrade",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    validateDowngradePlanController,
  );

  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  */

  app.get(
    "/stores/me/subscription",
    {
      preHandler: [verifyUserRole("ADMIN")],
    },
    getStoreSubscription,
  );

  app.post(
    "/stores/me/subscription/change-plan",
    {
      preHandler: [verifyUserRole("ADMIN")],
    },
    changeStorePlan,
  );

  app.patch(
    "/stores/me/subscription/cancel",
    {
      preHandler: [verifyUserRole("ADMIN")],
    },
    cancelSubscription,
  );

  app.get(
    "/stores/me/subscription/limits/:resource",
    {
      preHandler: [verifyUserRole("ADMIN", "SUPER_ADMIN")],
    },
    validateStoreLimits,
  );
}
