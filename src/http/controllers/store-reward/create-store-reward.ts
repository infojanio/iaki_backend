// src/http/controllers/stores/rewards/create-store-reward-controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateStoreRewardUseCase } from "@/use-cases/_factories/make-create-store-reward-use-case";

export async function createStoreReward(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    pointsCost: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    image: z.string().optional(),
    expiresAt: z.string().optional(),
    maxPerUser: z.number().int().optional(),
  });

  const data = bodySchema.parse(request.body);

  const user = request.user as any;

  if (!user.storeId) {
    return reply.status(403).send({
      message: "Administrador não vinculado à loja.",
    });
  }

  const useCase = makeCreateStoreRewardUseCase();

  const result = await useCase.execute({
    storeId: user.storeId,
    title: data.title,
    description: data.description,
    pointsCost: data.pointsCost,
    stock: data.stock,
    image: data.image,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    maxPerUser: data.maxPerUser,
  });

  return reply.status(201).send(result.reward);
}
