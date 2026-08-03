import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

export async function getMyRewardRedemption(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    redemptionId: z.string().uuid("ID do resgate inválido."),
  });

  const { redemptionId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;

  const redemption = await prisma.storeRewardRedemption.findFirst({
    where: {
      id: redemptionId,

      /*
       * Impede um usuário de consultar
       * o resgate pertencente a outro.
       */
      userId,
    },

    include: {
      reward: {
        select: {
          id: true,
          storeId: true,
          title: true,
          description: true,
          pointsCost: true,
          stock: true,
          isActive: true,
          image: true,
          expiresAt: true,
          maxPerUser: true,
        },
      },

      store: {
        select: {
          id: true,
          name: true,
          avatar: true,
          phone: true,
        },
      },

      user: {
        select: {
          id: true,
          name: true,
          cpf: true,
          phone: true,
        },
      },
    },
  });

  if (!redemption) {
    return reply.status(404).send({
      message: "Resgate não encontrado ou não pertence ao usuário autenticado.",
    });
  }

  return reply.status(200).send({
    redemption: {
      id: redemption.id,

      rewardId: redemption.rewardId,

      userId: redemption.userId,

      storeId: redemption.storeId,

      points: Number(redemption.points),

      status: redemption.status,

      createdAt: redemption.createdAt,

      usedAt: redemption.usedAt,

      reward: redemption.reward,

      store: redemption.store,

      user: redemption.user,
    },
  });
}
