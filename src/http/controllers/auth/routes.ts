import { FastifyInstance } from "fastify";

import { forgotPassword } from "./forgot-password";

import { resetPassword } from "./reset-password";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/password/forgot",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    forgotPassword,
  );

  app.post(
    "/password/reset",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
    },
    resetPassword,
  );
}
