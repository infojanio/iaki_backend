import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetReelsByStoreUseCase } from "@/use-cases/_factories/make-get-reels-by-store-use-case";

export async function getReelsByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const getReelsByStoreUseCase = makeGetReelsByStoreUseCase();

  const { reels } = await getReelsByStoreUseCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: reels,
  });
}
