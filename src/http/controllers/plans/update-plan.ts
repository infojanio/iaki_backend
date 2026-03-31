import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdatePlanUseCase } from "@/use-cases/_factories/make-update-plan-use-case";
import { PlanAlreadyExistsError } from "@/utils/messages/errors/plan-already-exists-error";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

export async function updatePlan(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    price: z.number().nonnegative().optional(),
    durationDays: z.number().int().positive().optional(),
    maxProducts: z.number().int().nonnegative().nullable().optional(),
    maxBanners: z.number().int().nonnegative().nullable().optional(),
    maxReels: z.number().int().nonnegative().nullable().optional(),
    maxCategories: z.number().int().nonnegative().nullable().optional(),
    isActive: z.boolean().optional(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);

    const useCase = makeUpdatePlanUseCase();

    const { plan } = await useCase.execute({
      id,
      ...body,
    });

    return reply.status(200).send({ plan });
  } catch (error) {
    if (error instanceof PlanNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof PlanAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
