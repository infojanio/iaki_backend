import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateBannerUseCase } from "@/use-cases/_factories/make-create-banner-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBannerBodySchema = z.object({
    title: z.string(),
    imageUrl: z.string(),
    link: z.string(),
    position: z.number(),
    storeId: z.string(),
    createdAt: z.date().optional(),
  });
  const { title, imageUrl, link, position, storeId, createdAt } =
    createBannerBodySchema.parse(request.body);
  const createBannerUseCase = makeCreateBannerUseCase();
  await createBannerUseCase.execute({
    title,
    imageUrl,
    link,
    position,
    storeId,
    createdAt: new Date(),
  });

  return reply.status(201).send();
}
