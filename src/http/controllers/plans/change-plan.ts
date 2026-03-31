import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSubscribeStoreToPlanUseCase } from "@/use-cases/_factories/make-subscribe-store-to-plan-use-case";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

export async function changeStorePlan(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    planId: z.string().uuid(),
  });

  const { planId } = bodySchema.parse(request.body);
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  try {
    const useCase = makeSubscribeStoreToPlanUseCase();

    const { subscription } = await useCase.execute({
      storeId,
      planId,
      isTrial: false,
    });

    return reply.status(200).send({ subscription });
  } catch (error) {
    if (error instanceof PlanNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
