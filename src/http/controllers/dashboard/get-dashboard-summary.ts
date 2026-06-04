import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetDashboardSummaryUseCase } from "@/use-cases/_factories/make-get-dashboard-summary-use-case";

export async function getDashboardSummary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const role = request.user.role;

  const storeId = request.user.storeId;

  const useCase = makeGetDashboardSummaryUseCase();

  const { summary } = await useCase.execute({
    storeId: role === "SUPER_ADMIN" ? undefined : storeId,
  });

  return reply.status(200).send({
    summary,
  });
}
