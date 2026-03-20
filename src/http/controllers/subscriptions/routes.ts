import { FastifyInstance } from "fastify";
import { subscribeStoreToPlan } from "../subscriptions/subscribe-store-to-plan";
import { getStoreSubscription } from "../subscriptions/get-store-subscription";
import { validateStoreLimits } from "../subscriptions/validate-store-limits";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function subscriptionRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post(
    "/subscriptions",
    {
      preHandler: [verifyUserRole("SUPER_ADMIN")],
    },
    subscribeStoreToPlan,
  );

  app.get(
    "/stores/me/subscription",
    {
      preHandler: [verifyUserRole("ADMIN", "SUPER_ADMIN")],
    },
    getStoreSubscription,
  );

  app.get(
    "/stores/me/subscription/limits/:resource",
    {
      preHandler: [verifyUserRole("ADMIN", "SUPER_ADMIN")],
    },
    validateStoreLimits,
  );
}
