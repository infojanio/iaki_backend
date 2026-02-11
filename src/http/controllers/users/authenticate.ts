import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-cases/_factories/make-authenticate-use-case";
import { prisma } from "@/lib/prisma";
import { InvalidCredentialsError } from "@/utils/messages/errors/invalid-credentials-error";
import { AdminWithoutStoreError } from "@/utils/messages/errors/admin-without-store-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    // 💰 saldo do usuário (opcional, mantido)
    const cashback = await prisma.cashback.aggregate({
      where: {
        userId: user.id,
        status: "CONFIRMED",
      },
      _sum: {
        amount: true,
      },
    });

    const userBalance = cashback._sum.amount ?? 0;

    // 🔐 ACCESS TOKEN (15 min)
    const accessToken = await reply.jwtSign(
      {
        role: user.role,
        storeId: user.storeId ?? null,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "15m",
        },
      },
    );

    // 🔁 REFRESH TOKEN (7 dias)
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
        storeId: user.storeId ?? null,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    // 💾 salva refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        balance: userBalance,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        message: err.message,
      });
    }

    if (err instanceof AdminWithoutStoreError) {
      return reply.status(403).send({
        message: err.message,
      });
    }

    console.error("[AUTH ERROR]", err);

    return reply.status(500).send({
      message: "Erro interno ao autenticar usuário.",
    });
  }
}
