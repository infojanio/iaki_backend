import { makeUpdateStoreDiscountUseCase } from "@/use-cases/_factories/make-update-store-discount-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function updateStoreDiscountController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    type: z.enum(["FIXED", "DAILY", "WEEKLY"]).optional(),
    value: z.number().positive().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    validFrom: z.coerce.date().optional(),
    validTo: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const useCase = makeUpdateStoreDiscountUseCase();
    const discount = await useCase.execute({
      id,
      data,
    });

    return reply.status(200).send(discount);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(400).send({
      message: error.message ?? "Erro ao atualizar desconto",
    });
  }
}
