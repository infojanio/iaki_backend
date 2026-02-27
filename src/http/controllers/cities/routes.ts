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
  // Toda rota exige JWT, como no padrão das categorias
  app.addHook("onRequest", verifyJWT);

  // LISTAR TODAS
  app.get("/cities", listCities);

  // LISTAR CIDADES ATIVAS
  app.get("/cities/active", listCitiesActive);

  // BUSCAR POR NOME / ESTADO
  app.get("/cities/search", searchCity);

  // Listar cidades por estado
  app.get("/states/:stateId/cities", listCitiesByStateController);

  // OBTER UMA CIDADE ESPECÍFICA
  app.get("/cities/:cityId", getCity);

  // ATUALIZAR CIDADE (ADMIN)
  app.patch(
    "/cities/:cityId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    updateCity,
  );

  // CRIAR CIDADE (ADMIN)
  app.post("/cities", { onRequest: [verifyUserRole("SUPER_ADMIN")] }, createCity);

  // DELETAR CIDADE (ADMIN)
  app.delete(
    "/cities/:cityId",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    deleteCity,
  );
}
