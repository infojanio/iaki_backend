import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateCategoryUseCase } from "@/use-cases/_factories/make-update-category-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

const updateCategoryBodySchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  image: z.string().optional(),
});

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const updateData = updateCategoryBodySchema.parse(request.body);

    const updateCategoryUseCase = makeUpdateCategoryUseCase();

    const updatedCategory = await updateCategoryUseCase.execute({
      ...updateData,
    });

    return reply.status(200).send({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Category update error:", error);

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        success: false,
        message: error.message,
      });
    }

    return reply.status(400).send({
      success: false,
      message: error instanceof Error ? error.message : "Invalid Category data",
    });
  }
}
