import { FastifyRequest, FastifyReply } from "fastify";
import { makeListPendingRedemptionsUseCase } from "@/use-cases/_factories/make-list-pending-redemptions-use-case";
import { z } from "zod";

export async function listMyPendingRedemptions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid("Identificador da loja inválido."),
  });

  const { storeId } = paramsSchema.parse(request.params);
  const userId = request.user.sub;

  if (!userId) {
    return reply.status(401).send({
      message: "Usuário não autenticado.",
    });
  }

  const useCase = makeListPendingRedemptionsUseCase();

  const redemptions = await useCase.execute({
    userId,
    storeId,
  });

  return reply.status(200).send(redemptions);
}
