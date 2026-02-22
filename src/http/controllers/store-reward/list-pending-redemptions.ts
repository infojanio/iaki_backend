import { FastifyRequest, FastifyReply } from "fastify";
import { makeListPendingRedemptionsUseCase } from "@/use-cases/_factories/make-list-pending-redemptions-use-case";

export async function listMyPendingRedemptions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = request.user as any;
  const { storeId } = request.params as { storeId: string };

  const useCase = makeListPendingRedemptionsUseCase();

  const redemptions = await useCase.execute({
    userId: user.id,
    storeId,
  });

  return reply.send(redemptions);
}
