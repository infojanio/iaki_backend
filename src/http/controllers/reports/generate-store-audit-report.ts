import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { createStoreAuditPdf } from "@/providers/pdf/store-audit-pdf";
import { makeGenerateStoreAuditReportUseCase } from "@/use-cases/_factories/make-generate-store-audit-report-use-case";

const querySchema = z.object({
  from: z.string().optional(),

  to: z.string().optional(),
});

function startOfDay(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Date(`${value}T00:00:00.000-03:00`);
}

function endOfDay(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Date(`${value}T23:59:59.999-03:00`);
}

export async function generateStoreAuditReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { from, to } = querySchema.parse(request.query);

  const { sub: adminId, storeId } = request.user;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não possui loja vinculada.",
    });
  }

  const useCase = makeGenerateStoreAuditReportUseCase();

  const { report } = await useCase.execute({
    storeId,
    adminId,

    from: startOfDay(from),

    to: endOfDay(to),
  });

  const pdf = createStoreAuditPdf(report);

  const date = new Date().toISOString().slice(0, 10);

  const storeName = report.store.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();

  const fileName = `auditoria-${storeName}-${date}.pdf`;

  reply.header("Content-Type", "application/pdf");

  reply.header("Content-Disposition", `attachment; filename="${fileName}"`);

  reply.header("Cache-Control", "no-store");

  return reply.send(pdf);
}
