import { FastifyReply, FastifyRequest } from "fastify";
import { SubscriptionStatus } from "@prisma/client";
import { z } from "zod";

import { makeCreateStoreSubscriptionUseCase } from "@/use-cases/_factories/make-create-store-subscription-use-case";

export async function createSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createSubscriptionBodySchema = z.object({
    storeId: z.string().uuid("Loja inválida."),
    planId: z.string().uuid("Plano inválido."),

    status: z.enum(["ACTIVE", "TRIALING"]).optional().default("ACTIVE"),

    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  });

  try {
    const { storeId, planId, status, startDate, endDate } =
      createSubscriptionBodySchema.parse(request.body);

    const createStoreSubscriptionUseCase = makeCreateStoreSubscriptionUseCase();

    const { subscription } = await createStoreSubscriptionUseCase.execute({
      storeId,
      planId,
      status: status as SubscriptionStatus,
      startDate,
      endDate,
    });

    return reply.status(201).send({
      message: "Assinatura criada com sucesso.",
      subscription,
    });
  } catch (error) {
    console.error("[CREATE SUBSCRIPTION ERROR]", error);

    return reply.status(400).send({
      message:
        error instanceof Error ? error.message : "Erro ao criar assinatura.",
    });
  }
}
