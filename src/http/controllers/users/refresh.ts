// src/http/controllers/auth/refresh.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = request.body as {
    refreshToken?: string;
  };

  if (!refreshToken) {
    return reply.status(400).send({
      message: "Refresh token é obrigatório.",
    });
  }

  // 🔎 1. Busca token no banco
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    return reply.status(401).send({
      message: "Refresh token inválido.",
    });
  }

  // ⏰ 2. Verifica expiração no banco
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    return reply.status(401).send({
      message: "Refresh token expirado.",
    });
  }

  try {
    const decoded = request.server.jwt.verify<{
      sub: string;
      role: string;
      storeId?: string;
    }>(refreshToken);

    const { sub: userId, role, storeId } = decoded;

    const newAccessToken = await reply.jwtSign(
      { role, storeId },
      {
        sign: {
          sub: userId,
          expiresIn: "15m",
        },
      },
    );

    const newRefreshToken = await reply.jwtSign(
      { role, storeId },
      {
        sign: {
          sub: userId,
          expiresIn: "7d",
        },
      },
    );

    // remove token antigo
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // salva novo refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    return reply.status(401).send({
      message: "Refresh token inválido.",
    });
  }
}
