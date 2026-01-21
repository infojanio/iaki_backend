import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBannersByCityUseCase } from "@/use-cases/_factories/make-get-banners-by-city-use-case";

export async function getBannersByCityController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = paramsSchema.parse(request.params);

  const getBannersByCityUseCase = makeGetBannersByCityUseCase();

  const banner = await getBannersByCityUseCase.execute({ cityId });

  return reply.status(200).send(banner);
}
