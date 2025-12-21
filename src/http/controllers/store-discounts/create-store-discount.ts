import { makeCreateStoreDiscountUseCase } from "@/use-cases/_factories/make-create-store-discount-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createStoreDiscountController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    type: z.enum(["FIXED", "DAILY", "WEEKLY"]),
    value: z.number().positive(),
    title: z.string().optional(),
    description: z.string().optional(),
    validFrom: z.coerce.date().optional(),
    validTo: z.coerce.date().optional(),
  });

  try {
    const data = bodySchema.parse(request.body);

    const useCase = makeCreateStoreDiscountUseCase();
    const discount = await useCase.execute(data);

    return reply.status(201).send(discount);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(400).send({
      message: error.message ?? "Erro ao criar desconto da loja",
    });
  }
}
