import { makeUpdateUserCityUseCase } from "@/use-cases/_factories/make-update-user-city-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function updateUserCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub; // JWT
  const bodySchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = bodySchema.parse(request.body);

  const useCase = makeUpdateUserCityUseCase();
  const { user } = await useCase.execute({ userId, cityId });

  return reply.status(200).send(user);
}
