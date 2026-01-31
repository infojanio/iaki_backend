import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetOpenCartUseCase } from "@/use-cases/_factories/make-get-open-cart-use-case";

export async function getOpenCartController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.sub as string;

    const useCase = makeGetOpenCartUseCase();
    const cart = await useCase.execute({ userId });

    if (!cart) {
      // 🔥 Frontend interpreta corretamente carrinho inexistente
      return reply.status(204).send();
    }

    return reply.status(200).send({
      id: cart.id,
      storeId: cart.storeId,
      storeName: cart.storeName, // 🔥 ESSENCIAL
      itemsCount: cart.itemsCount,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao buscar carrinho aberto",
    });
  }
}
