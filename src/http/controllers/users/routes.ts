import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { register } from "./register";
import { refresh } from "./refresh";
import { balance } from "./balance";
import { update } from "./update";
import { getUserLocation } from "./get-user-location";
import { createUserLocation } from "./create-user-location";
import { getUserAddress } from "../addresses/get-address";
import { GetUserProfileEdit } from "@/use-cases/users/get-user-profile-edit";
import { profileEdit } from "./get-profile";
import { updateUserCity } from "./update-user-city";
import { getUserStoresPoints } from "./get-user-stores-points";

export async function usersRoutes(app: FastifyInstance) {

  // Públicas
  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.post("/token/refresh", refresh);

  // Autenticadas (cliente)
  app.addHook("onRequest", verifyJWT);

  app.get("/users/me", profile);
  app.patch("/users/me", update);
  app.patch("/users/me/city", updateUserCity);
  app.get("/users/me/balance", balance);
  app.get("/users/me/stores-with-points", getUserStoresPoints);
}
  /* SUPER_ADMIN
  app.post(
    "/users/admin",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    createAdmin,
  );

  app.get(
    "/users",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    listUsers,
  );
}
*/