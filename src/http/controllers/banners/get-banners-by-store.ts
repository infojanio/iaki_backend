import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeGetBannersByStoreUseCase } from "@/use-cases/_factories/make-get-banners-by-store-use-case";

export async function getBannersByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  try {
    // 🔥 tenta pegar do usuário autenticado
    const userStoreId = request.user?.storeId;

    // 🔥 tenta pegar da URL
    const params = paramsSchema.safeParse(request.params);

    const paramsStoreId = params.success ? params.data.storeId : undefined;

    // 🔥 prioridade:
    // ADMIN -> request.user.storeId
    // MOBILE -> params.storeId
    const storeId = userStoreId ?? paramsStoreId;

    if (!storeId) {
      return reply.status(400).send({
        message: "StoreId não informado.",
      });
    }

    const getBannersByStoreUseCase = makeGetBannersByStoreUseCase();

    const { banners } = await getBannersByStoreUseCase.execute({
      storeId,
    });

    return reply.status(200).send({
      data: banners,
    });
  } catch (error) {
    console.error("[GET BANNERS BY STORE ERROR]", error);

    return reply.status(500).send({
      message: "Internal server error.",
    });
  }
}
