import { FastifyReply, FastifyRequest } from "fastify";
import { makeListStoresActiveUseCase } from "@/use-cases/_factories/make-list-stores-active-use-case";

export async function listStoresActive(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listStoresActiveUseCase = makeListStoresActiveUseCase();

  const stores = await listStoresActiveUseCase.execute();

  return reply.status(200).send(stores);
}
