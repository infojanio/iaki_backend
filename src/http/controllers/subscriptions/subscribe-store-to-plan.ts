import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSubscribeStoreToPlanUseCase } from "@/use-cases/_factories/make-subscribe-store-to-plan-use-case";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

export async function subscribeStoreToPlan(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    planId: z.string().uuid(),
    isTrial: z.boolean().optional(),
    customDurationDays: z.number().int().positive().optional(),
  });

  try {
    const { storeId, planId, isTrial, customDurationDays } = bodySchema.parse(
      request.body,
    );

    const useCase = makeSubscribeStoreToPlanUseCase();

    const { subscription } = await useCase.execute({
      storeId,
      planId,
      isTrial,
      customDurationDays,
    });

    return reply.status(201).send({ subscription });
  } catch (error: any) {
    if (error instanceof PlanNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
