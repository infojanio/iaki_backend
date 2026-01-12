import { makeFetchStoreByIdUseCase } from "@/use-cases/_factories/make-fetch-store-by-id";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function FetchStoreById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  try {
    console.log("🟣 [Controller] params recebidos:", request.params);
    const { storeId } = paramsSchema.parse(request.params);

    const useCase = makeFetchStoreByIdUseCase();
    const { store } = await useCase.execute({ storeId });

    console.log("🟣 [Controller] loja retornada:", store?.name);

    return reply.status(200).send(store);
  } catch {
    return reply.status(400).send({
      message: "Erro ao encontrar loja",
    });
  }
}
