import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateSubscriptionEndDateUseCase } from "@/use-cases/_factories/make-update-subscription-end-date-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

export async function updateSubscriptionEndDate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    subscriptionId: z.string().uuid(),
  });

  const bodySchema = z.object({
    endDate: z.coerce.date(),
  });

  try {
    const { subscriptionId } = paramsSchema.parse(request.params);
    const { endDate } = bodySchema.parse(request.body);

    const user = request.user as { storeId?: string };

    if (!user.storeId) {
      return reply.status(403).send({
        message: "Usuário não vinculado a uma loja.",
      });
    }

    const useCase = makeUpdateSubscriptionEndDateUseCase();

    const result = await useCase.execute({
      subscriptionId,
      endDate,
      storeId: user.storeId,
    });

    return reply.status(200).send({
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(400).send({
      message: error instanceof Error ? error.message : "Erro ao atualizar",
    });
  }
}
