import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateBannerUseCase } from "@/use-cases/_factories/make-create-banner-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBannerBodySchema = z.object({
    title: z.string(),
    imageUrl: z.string(),
    link: z.string().optional(),
    position: z.number().optional(),
    storeId: z.string().optional(), // 🔥 agora opcional
  });

  const parsed = createBannerBodySchema.parse(request.body);

  // 🔥 regra multi-tenant correta
  const storeId =
    request.user.role === "SUPER_ADMIN" ? parsed.storeId : request.user.storeId;

  // 🔥 validação obrigatória
  if (!storeId) {
    return reply.status(400).send({
      message: "Loja não identificada.",
    });
  }

  const createBannerUseCase = makeCreateBannerUseCase();

  try {
    await createBannerUseCase.execute({
      title: parsed.title,
      imageUrl: parsed.imageUrl,
      link: parsed.link,
      position: parsed.position,
      storeId,
      createdAt: new Date(),
    });

    return reply.status(201).send();
  } catch (err: any) {
    console.error("CREATE BANNER ERROR:", err);

    return reply.status(500).send({
      message: err?.message || "Internal server error.",
    });
  }
}
