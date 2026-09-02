import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeSearchProductsUseCase } from "@/use-cases/_factories/make-search-products-use-case";

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchQuerySchema = z.object({
    query: z.string().catch(""),
    cityId: z.string().uuid(),

    page: z.coerce.number().int().positive().catch(1),

    pageSize: z.coerce.number().int().positive().catch(24),
  });

  const { query, cityId, page, pageSize } = searchQuerySchema.parse(
    request.query,
  );

  const searchProductsUseCase = makeSearchProductsUseCase();

  const { products, total } = await searchProductsUseCase.execute({
    query,
    cityId,
    page,
    pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  return reply.status(200).send({
    products,

    pagination: {
      total,
      totalPages,
      currentPage: page,
      pageSize,
    },
  });
}
