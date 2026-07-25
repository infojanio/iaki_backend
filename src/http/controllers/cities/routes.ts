import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { createCity } from "./create-city";
import { listCities } from "./list-cities";
import { listCitiesActive } from "./list-cities-active";
import { getCity } from "./get-city";
import { searchCity } from "./search-city";
import { updateCity } from "./update-city";
import { deleteCity } from "./delete-city";
import { listCitiesByStateController } from "./list-cities-by-state";

export async function citiesRoutes(app: FastifyInstance) {
  /**
   * ROTAS PÚBLICAS
   */

  app.get("/cities", listCities);

  app.get("/cities/active", listCitiesActive);

  /**
   * ROTAS AUTENTICADAS
   */

  app.get("/cities/search", { onRequest: [verifyJWT] }, searchCity);

  app.get(
    "/states/:stateId/cities",
    { onRequest: [verifyJWT] },
    listCitiesByStateController,
  );

  app.get("/cities/:cityId", { onRequest: [verifyJWT] }, getCity);

  /**
   * ROTAS EXCLUSIVAS DO SUPER_ADMIN
   */

  app.patch(
    "/cities/:cityId",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    updateCity,
  );

  app.post(
    "/cities",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    createCity,
  );

  app.delete(
    "/cities/:cityId",
    {
      onRequest: [verifyJWT, verifyUserRole("SUPER_ADMIN")],
    },
    deleteCity,
  );
}
