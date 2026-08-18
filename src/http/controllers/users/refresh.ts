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

  // 1. Busca token no banco
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    return reply.status(401).send({
      message: "Refresh token inválido.",
    });
  }

  // 2. Verifica expiração
  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    return reply.status(401).send({
      message: "Refresh token expirado.",
    });
  }

  try {
    // 3. Valida JWT
    const decoded = request.server.jwt.verify<{
      sub: string;
    }>(refreshToken);

    const userId = decoded.sub;

    // 4. Confirma que usuário ainda existe
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        role: true,
        storeId: true,
      },
    });

    if (!user) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
        },
      });

      return reply.status(401).send({
        message: "Usuário não encontrado.",
      });
    }

    // 5. Verifica se conta foi excluída
    const accountDeleted =
      user.email.startsWith("deleted+") &&
      user.email.endsWith("@deleted.iaki.local");

    if (accountDeleted) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
        },
      });

      return reply.status(401).send({
        message: "Esta conta não está mais disponível.",
      });
    }

    // 6. Gera novo access token
    const newAccessToken = await reply.jwtSign(
      {
        role: user.role,
        storeId: user.storeId ?? undefined,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "15m",
        },
      },
    );

    // 7. Gera novo refresh token
    const newRefreshToken = await reply.jwtSign(
      {
        role: user.role,
        storeId: user.storeId ?? undefined,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    // 8. Remove token antigo
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    // 9. Salva novo refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,

        userId: user.id,

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.status(200).send({
      accessToken: newAccessToken,

      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("[RefreshToken]", error);

    return reply.status(401).send({
      message: "Refresh token inválido.",
    });
  }
}
