import { makeRedeemStoreRewardUseCase } from "@/use-cases/_factories/make-redeem-store-reward-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function redeemStoreReward(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
    rewardId: z.string().uuid(),
  });

  const { storeId, rewardId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;

  const redeemStoreRewardUseCase = makeRedeemStoreRewardUseCase();

  try {
    const result = await redeemStoreRewardUseCase.execute({
      userId,
      storeId,
      rewardId,
    });

    return reply.status(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message,
    });
  }
}
