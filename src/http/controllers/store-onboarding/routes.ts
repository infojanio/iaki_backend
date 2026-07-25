import { FastifyInstance } from "fastify";
import { createStoreOnboarding } from "./create";

export async function storeOnboardingRoutes(app: FastifyInstance) {
  app.post(
    "/store-onboarding",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    createStoreOnboarding,
  );
}
