// src/http/controllers/stores/rewards/validate-store-reward-redemption.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ValidateStoreRewardRedemptionUseCase } from "@/use-cases/store-points/validate-store-reward-redemption-use-case";

export async function validateStoreRewardRedemption(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    redemptionId: z.string().uuid(),
  });

  const { redemptionId } = paramsSchema.parse(request.params);

  const user = request.user as any;

  if (!user.storeId) {
    return reply.status(403).send({
      message: "Administrador não vinculado a loja.",
    });
  }

  const useCase = new ValidateStoreRewardRedemptionUseCase();

  try {
    const result = await useCase.execute({
      redemptionId,
      storeId: user.storeId,
    });

    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message,
    });
  }
}
