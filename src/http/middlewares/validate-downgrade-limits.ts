import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";

type LimitedResource = "products" | "banners" | "reels";

export async function validateDowngradeLimits(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;
  const { planId } = request.body as { planId: string };

  if (!storeId || !planId) {
    return reply.status(400).send({
      message: "Dados inválidos para alteração de plano.",
    });
  }

  // 🔥 busca plano novo
  const newPlan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!newPlan) {
    return reply.status(404).send({
      message: "Plano não encontrado.",
    });
  }

  // 🔥 uso atual
  const [products, banners, reels] = await Promise.all([
    prisma.product.count({ where: { storeId } }),
    prisma.banner.count({ where: { storeId } }),
    prisma.reel.count({ where: { storeId } }),
  ]);

  /**
   * 🔥 validações
   */
  const errors: string[] = [];

  const exceeded: {
    resource: LimitedResource;
    current: number;
    limit: number;
  }[] = [];

  if (newPlan.maxProducts !== null && products > newPlan.maxProducts) {
    exceeded.push({
      resource: "products",
      current: products,
      limit: newPlan.maxProducts,
    });
  }

  if (newPlan.maxBanners !== null && banners > newPlan.maxBanners) {
    exceeded.push({
      resource: "banners",
      current: banners,
      limit: newPlan.maxBanners,
    });
  }

  if (newPlan.maxReels !== null && banners > newPlan.maxReels) {
    exceeded.push({
      resource: "reels",
      current: reels,
      limit: newPlan.maxReels,
    });
  }

  /**
   * 🔥 BLOQUEIO
   */
  if (errors.length > 0) {
    return reply.status(403).send({
      message:
        "Não é possível mudar para este plano. Reduza os itens abaixo do limite:",
      code: "DOWNGRADE_NOT_ALLOWED",
      details: errors,
    });
  }
}
