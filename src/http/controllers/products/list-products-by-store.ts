import { makeListProductsByStoreUseCase } from "@/use-cases/_factories/make-list-products-by-store-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function listProductsByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const user = request.user as {
      storeId?: string;
      role: string;
    };

    if (!user.storeId) {
      return reply.status(403).send({
        message: "Usuário não vinculado a uma loja.",
      });
    }

    const useCase = makeListProductsByStoreUseCase();

    const { products } = await useCase.execute({
      storeId: user.storeId, // 🔥 FIX PRINCIPAL
    });

    return reply.status(200).send({
      data: products,
    });
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao listar produtos da loja",
    });
  }
}
