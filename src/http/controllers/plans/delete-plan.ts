import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDeletePlanUseCase } from "@/use-cases/_factories/make-delete-plan-use-case";
import { PlanHasSubscriptionsError } from "@/utils/messages/errors/plan-has-subscriptions-error";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

export async function deletePlan(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeletePlanUseCase();

    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof PlanNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof PlanHasSubscriptionsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
