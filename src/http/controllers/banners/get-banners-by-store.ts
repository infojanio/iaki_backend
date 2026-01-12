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

  const { storeId } = paramsSchema.parse(request.params);

  const getBannersByStoreUseCase = makeGetBannersByStoreUseCase();

  const banner = await getBannersByStoreUseCase.execute({ storeId });

  return reply.status(200).send(banner);
}
