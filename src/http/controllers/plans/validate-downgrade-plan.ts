import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeValidateDowngradePlanUseCase } from "@/use-cases/_factories/make-validate-downgrade-plan-use-case";

export async function validateDowngradePlanController(
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

  const useCase = makeValidateDowngradePlanUseCase();

  const result = await useCase.execute({
    storeId,
    newPlanId: planId,
  });

  if (!result.allowed) {
    return reply.status(403).send({
      message: "Você precisa reduzir os itens abaixo antes de mudar de plano.",
      code: "DOWNGRADE_NOT_ALLOWED",
      exceeded: result.exceeded,
    });
  }

  return reply.status(200).send({
    message: "Downgrade permitido.",
  });
}
