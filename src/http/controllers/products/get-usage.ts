import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetStoreUsageUseCase } from "@/use-cases/_factories/make-get-store-usage-use-case";

export async function getUsage(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as {
    sub: string;
    role: string;
    storeId?: string;
  };

  if (!user.storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja",
    });
  }

  const useCase = makeGetStoreUsageUseCase();

  const result = await useCase.execute({
    storeId: user.storeId,
  });

  return reply.send(result);
}
