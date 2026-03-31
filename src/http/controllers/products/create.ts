import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateProductUseCase } from "@/use-cases/_factories/make-create-product-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProductBodySchema = z.object({
    subcategoryId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number().positive(),
    quantity: z.number().min(0),
    image: z.string().nullable(),
    cashbackPercentage: z.number().min(0),
    status: z.boolean().default(true),
  });

  try {
    const user = request.user as {
      storeId?: string;
    };

    if (!user.storeId) {
      return reply.status(403).send({
        message: "Usuário não vinculado a uma loja.",
      });
    }

    const body = createProductBodySchema.parse(request.body);

    const productUseCase = makeCreateProductUseCase();

    const { product } = await productUseCase.execute({
      ...body,
      storeId: user.storeId, // 🔥 FIX PRINCIPAL
    });

    return reply.status(201).send({
      data: product,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("Erro interno:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
