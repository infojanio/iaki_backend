import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateReelUseCase } from "@/use-cases/_factories/make-create-reel-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createReelBodySchema = z.object({
    title: z.string(),
    imageUrl: z.string(),
    link: z.string(),
    storeId: z.string().uuid().optional(),
  });
  const {
    title,
    imageUrl,
    link,
    storeId: bodyStoreId,
  } = createReelBodySchema.parse(request.body);

  let storeId = request.user.storeId;

  // 🔥 SUPER_ADMIN pode escolher
  if (request.user.role === "SUPER_ADMIN") {
    storeId = bodyStoreId;
  }

  if (!storeId) {
    return reply.status(403).send({
      message: "StoreId obrigatório.",
    });
  }

  const createReelUseCase = makeCreateReelUseCase();
  await createReelUseCase.execute({
    title,
    imageUrl,
    link,
    storeId,
    createdAt: new Date(),
  });

  return reply.status(201).send();
}
