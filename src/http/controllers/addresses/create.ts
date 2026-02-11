import { z } from "zod"; // responsável pela validação dos dados
import { FastifyReply, FastifyRequest } from "fastify";
import { UserAlreadyExistsError } from "@/utils/messages/errors/user-already-exists-error";
import { makeAddressUseCase } from "@/use-cases/_factories/make-address-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerAddressBodySchema = z
    .object({
      // id: z.string(),
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      storeId: z.string().optional().nullable(),
      userId: z.string().optional().nullable(),
    })
    .refine((data) => data.storeId || data.userId, {
      message: "storeId ou userId deve ser informado.",
    });

  const {
    // id,
    street,
    city,
    state,
    postalCode,
    storeId,
    userId,
    // addressId,
    // address_id,
    // createdAt,
  } = registerAddressBodySchema.parse(request.body);

  try {
    const addressUseCase = makeAddressUseCase();
    await addressUseCase.execute({
      // id,
      street,
      city,
      state,
      postalCode,
      storeId,
      userId,

      //  addressId,
      // address_id,
      // createdAt,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
}
