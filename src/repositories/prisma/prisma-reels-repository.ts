import { prisma } from "@/lib/prisma";
import { Reel, Prisma } from "@prisma/client";
import { ReelsRepository } from "./Iprisma/reels-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
export class PrismaReelsRepository implements ReelsRepository {
  async findById(id: string) {
    const reel = await prisma.reel.findUnique({
      where: {
        id,
      },
    });
    return reel;
  }

  async findPremiumByCity(cityId: string, limit: number = 4): Promise<Reel[]> {
    const now = new Date();

    return prisma.reel.findMany({
      where: {
        store: {
          cityId,
          isActive: true,

          subscriptions: {
            some: {
              status: "ACTIVE",

              startDate: {
                lte: now,
              },

              endDate: {
                gte: now,
              },

              plan: {
                name: "PREMIUM",
                isActive: true,
              },
            },
          },
        },
      },

      orderBy: [
        {
          createdAt: "desc",
        },
      ],

      take: limit,

      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async listMany(): Promise<Reel[]> {
    const reels = await prisma.reel.findMany();
    return reels;
  }

  async findManyByStoreId(storeId: string) {
    return prisma.reel.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdReel(id: string): Promise<Reel | null> {
    const reel = await prisma.reel.findUnique({
      where: {
        id,
      },
    });
    return reel;
  }

  async update(
    id: string,
    data: {
      title?: string;
      imageUrl?: string;
      link?: string;
    },
  ): Promise<Reel> {
    return prisma.reel.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async searchMany(query?: string, page: number = 1): Promise<Reel[]> {
    // Se o query for vazio ou não fornecido, retorna todas as categorias paginadas
    if (!query) {
      return await prisma.reel.findMany({
        skip: (page - 1) * 20,
        take: 20,
      });
    }

    // Busca as categorias com base no query
    return await prisma.reel.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive", // Busca case-insensitive (maíuscula ou minúscula)
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    });
  }

  async create(data: Prisma.ReelUncheckedCreateInput) {
    const reel = await prisma.reel.create({
      data,
    });
    return reel;
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.reel.delete({ where: { id } });
    } catch (err) {
      // Se quiser mapear para um erro da sua camada de domínio:
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new ResourceNotFoundError();
        // ex: throw err; // ou faça o mapeamento acima
      }
      throw err;
    }
  }
}
