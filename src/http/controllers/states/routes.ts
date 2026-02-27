import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { createStateController } from "./create-state";
import { deleteStateController } from "./delete-state";
import { getStateController } from "./get-state";
import { listStatesController } from "./list-states";
import { updateStateController } from "./update-state";

export async function statesRoutes(app: FastifyInstance) {
  // Todas as rotas exigem autenticação
  app.addHook("onRequest", verifyJWT);

  // Listar estados (usado no app)
  app.get("/states", listStatesController);

  // Buscar estado por ID
  app.get("/states/:id", getStateController);

  // Criar estado (ADMIN)
  app.post(
    "/states",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    createStateController,
  );

  // Atualizar estado (ADMIN)
  app.patch(
    "/states/:id",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    updateStateController,
  );

  // Deletar estado (ADMIN)
  app.delete(
    "/states/:id",
    { onRequest: [verifyUserRole("SUPER_ADMIN")] },
    deleteStateController,
  );
}
