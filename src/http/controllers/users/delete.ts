import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeDeleteUserUseCase } from "@/use-cases/_factories/make-delete-user-use-case";

import { UserNotFoundError } from "@/utils/messages/errors/user-not-found-error";

export async function Delete(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserParamsSchema = z.object({
    userId: z.string().uuid("ID do usuário inválido."),
  });

  try {
    /*
     * Não recebemos dados pelo body.
     *
     * O DeleteUserUseCase é responsável por definir
     * quais dados serão removidos/anonimizados.
     */
    const { userId } = deleteUserParamsSchema.parse(request.params);

    const deleteUserUseCase = makeDeleteUserUseCase();

    const { message } = await deleteUserUseCase.execute({
      userId,
    });

    return reply.status(200).send({
      message,
    });
  } catch (error) {
    /*
     * Erro de validação do userId.
     */
    if (error instanceof z.ZodError) {
      console.error("❌ Erro de validação:", error.flatten().fieldErrors);

      return reply.status(400).send({
        message: "Erro de validação.",
        errors: error.flatten().fieldErrors,
      });
    }

    /*
     * Usuário não encontrado.
     */
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    /*
     * Proteção contra exclusão de ADMIN
     * ou SUPER_ADMIN.
     *
     * Depois podemos transformar isso em
     * uma classe de erro própria.
     */
    if (
      error instanceof Error &&
      error.message === "Somente contas de clientes podem ser excluídas."
    ) {
      return reply.status(403).send({
        message: error.message,
      });
    }

    console.error("❌ [DeleteUserController] Erro:", error);

    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  }
}
