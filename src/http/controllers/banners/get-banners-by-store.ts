import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBannersByStoreUseCase } from "@/use-cases/_factories/make-get-banners-by-store-use-case";

export async function getBannersByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const getBannersByStoreUseCase = makeGetBannersByStoreUseCase();

  const { banners } = await getBannersByStoreUseCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: banners,
  });
}
