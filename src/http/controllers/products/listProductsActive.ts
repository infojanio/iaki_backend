import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeListProductsActiveUseCase } from "@/use-cases/_factories/make-list-products-active-use-case";

export async function listProductsActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = querySchema.parse(request.query);

  const listProductsUseCase = makeListProductsActiveUseCase();

  const products = await listProductsUseCase.execute({ cityId });

  return reply.status(200).send(products);
}
