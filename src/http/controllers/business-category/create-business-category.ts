import { makeCreateBusinessCategoryUseCase } from "@/use-cases/_factories/make-create-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().min(2),
    image: z.string().nullable().optional(),
  });

  try {
    const data = bodySchema.parse(request.body);

    const useCase = makeCreateBusinessCategoryUseCase();
    const { category } = await useCase.execute(data);

    return reply.status(201).send(category);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(400).send({
      message: error.message ?? "Erro ao criar categoria",
    });
  }
}
