import { FastifyRequest, FastifyReply } from "fastify";

import { makeDeleteUserUseCase } from "@/use-cases/_factories/make-delete-user-use-case";

import { UserNotFoundError } from "@/utils/messages/errors/user-not-found-error";

export async function DeleteMe(request: FastifyRequest, reply: FastifyReply) {
  try {
    /*
     * O ID vem exclusivamente do JWT.
     */
    const userId = request.user.sub;

    const deleteUserUseCase = makeDeleteUserUseCase();

    const { message } = await deleteUserUseCase.execute({
      userId,
    });

    return reply.status(200).send({
      message,
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Somente contas de clientes podem ser excluídas."
    ) {
      return reply.status(403).send({
        message: error.message,
      });
    }

    console.error("❌ [DeleteMeController]", error);

    return reply.status(500).send({
      message: "Não foi possível excluir sua conta.",
    });
  }
}
