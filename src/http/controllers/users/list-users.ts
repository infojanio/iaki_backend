import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeListUsersUseCase } from "@/use-cases/_factories/make-list-users-use-case";

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().default(1),
    query: z.string().optional(),
  });

  try {
    const { page, query } = querySchema.parse(request.query);

    const listUsersUseCase = makeListUsersUseCase();

    const { users, total } = await listUsersUseCase.execute({
      page,
      query,
    });

    return reply.status(200).send({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        state: user.state,
        street: user.street,
        postalCode: user.postalCode,
        cityId: user.cityId,
        storeId: user.storeId,
        createdAt: user.createdAt,
      })),

      meta: {
        page,
        perPage: 10,
        totalCount: total,
        totalPages: Math.ceil(total / 10),
      },
    });
  } catch (error) {
    console.error("[LIST USERS ERROR]", error);

    return reply.status(500).send({
      message: "Erro ao listar usuários.",
    });
  }
}
