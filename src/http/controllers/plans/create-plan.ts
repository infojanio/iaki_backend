import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreatePlanUseCase } from "@/use-cases/_factories/make-create-plan-use-case";
import { PlanAlreadyExistsError } from "@/utils/messages/errors/plan-already-exists-error";

export async function createPlan(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string().min(2),
    price: z.number().nonnegative(),
    durationDays: z.number().int().positive(),
    maxProducts: z.number().int().nonnegative().nullable().optional(),
    maxBanners: z.number().int().nonnegative().nullable().optional(),
    maxReels: z.number().int().nonnegative().nullable().optional(),
    maxCategories: z.number().int().nonnegative().nullable().optional(),
    isActive: z.boolean().optional(),
  });

  try {
    const body = bodySchema.parse(request.body);

    const useCase = makeCreatePlanUseCase();

    const { plan } = await useCase.execute(body);

    return reply.status(201).send({ plan });
  } catch (error: any) {
    if (error instanceof PlanAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
