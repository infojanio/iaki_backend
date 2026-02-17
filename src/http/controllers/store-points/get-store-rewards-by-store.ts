import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetStoreRewardsUseCase } from "@/use-cases/_factories/make-get-store-rewards-use-case";

export async function getStoreRewardsByStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const useCase = makeGetStoreRewardsUseCase();

  const rewards = await useCase.execute({ storeId });

  return reply.status(200).send(rewards);
}
