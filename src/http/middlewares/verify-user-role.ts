import { FastifyReply, FastifyRequest } from "fastify";

type UserRole = "ADMIN" | "USER";

export function verifyUserRole(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user || !user.role) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return reply.status(403).send({
        message: "Usuário não autorizado.",
      });
    }

    // 🔥 REGRA CRÍTICA
    if (user.role === "ADMIN" && !user.storeId) {
      return reply.status(403).send({
        message: "Administrador não vinculado a nenhuma loja.",
      });
    }
  };
}
