import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateSubCategoryUseCase } from "@/use-cases/_factories/make-create-subcategory-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createSubCategoryBodySchema = z.object({
    name: z.string().min(1, "O nome da categoria é obrigatório"),
    image: z.string().nullable(),
    categoryId: z.string(),
    createdAt: z.date().optional(),
  });
  const { name, image, categoryId } = createSubCategoryBodySchema.parse(
    request.body,
  );
  const createSubCategoryUseCase = makeCreateSubCategoryUseCase();
  await createSubCategoryUseCase.execute({
    name,
    image,
    categoryId,
    createdAt: new Date(),
  });

  return reply.status(201).send();
}
