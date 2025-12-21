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

export async function usersRoutes(app: FastifyInstance) {
  /* Rotas acessíveis para usuário não autenticado */
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/users/city", { onRequest: [verifyJWT] }, updateUserCity);
  //app.get("/users/:userId/city", getUserLocation);

  app.patch("/users/:userId", { onRequest: [verifyJWT] }, update);
  app.get("/users/:userId/address", getUserAddress);
  app.get("/users/:userId/location", getUserLocation);
  app.post("/token/refresh", refresh); // pega o token e atualiza
  app.get("/me", { onRequest: [verifyJWT] }, profile);
  app.get("/users/profile", { onRequest: [verifyJWT] }, profileEdit);

  // app.put('/users/:id', { onRequest: [verifyJWT] }, update) //atualiza o usuário
  app.post("/users/location", createUserLocation);
  app.get(
    "/users/balance",
    {
      onRequest: [verifyJWT],
    },
    balance,
  );

  /* Rotas exclusivas para usuário autenticado */
}
