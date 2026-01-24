import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchProductsBySubCategoryUseCase } from "@/use-cases/_factories/make-fetch-products-by-subcategory-use-case";

export async function fetchProductsBySubCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const fetchProductsQuerySchema = z.object({
      subcategoryId: z.string().uuid(),
      storeId: z.string().uuid(),
    });

    const { subcategoryId, storeId } = fetchProductsQuerySchema.parse(
      request.query,
    );

    const fetchProductsBySubCategoryUseCase =
      makeFetchProductsBySubCategoryUseCase();

    const products = await fetchProductsBySubCategoryUseCase.execute({
      subcategoryId,
      storeId, // ✅ AGORA CORRETO
    });

    return reply.status(200).send(products);
  } catch (error) {
    return reply.status(400).send({ error });
  }
}
