import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchProductsUseCase } from "@/use-cases/_factories/make-search-products-use-case";
import { makeListProductsActiveUseCase } from "@/use-cases/_factories/make-list-products-active-use-case";

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchQuerySchema = z.object({
    query: z.string().catch(""),
    page: z.coerce.number().int().positive().catch(1),
    pageSize: z.coerce.number().int().positive().catch(5),
  });

  const { query, page, pageSize } = searchQuerySchema.parse(request.query);

  const searchProductsUseCase = makeSearchProductsUseCase();

  const { products, total } = await searchProductsUseCase.execute({
    query,
    page,
    pageSize,
  });

  return reply.send({
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  });
}
