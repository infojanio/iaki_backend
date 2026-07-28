import { prisma } from "@/lib/prisma";
import { Banner, Prisma } from "@prisma/client";
import { BannersRepository } from "./Iprisma/banners-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
export class PrismaBannersRepository implements BannersRepository {
  /*banner valido por 30 dias
  private getValidBannerDate() {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    return sevenDaysAgo;
  }
    */

  async findById(id: string) {
    const banner = await prisma.banner.findUnique({
      where: {
        id,
      },
    });
    return banner;
  }

  async findPremiumByCity(
    cityId: string,
    limit: number = 4,
  ): Promise<Banner[]> {
    const now = new Date();

    /*
     * Busca todos os banners elegíveis.
     * Não aplica take nem orderBy antes do sorteio.
     */
    const eligibleBanners = await prisma.banner.findMany({
      where: {
        isActive: true,

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

      select: {
        id: true,
      },
    });

    if (eligibleBanners.length === 0) {
      return [];
    }

    /*
     * Cria uma cópia dos IDs para não alterar
     * diretamente o resultado retornado pelo Prisma.
     */
    const shuffledBannerIds = eligibleBanners.map((banner) => banner.id);

    /*
     * Embaralhamento Fisher-Yates.
     */
    for (let index = shuffledBannerIds.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [shuffledBannerIds[index], shuffledBannerIds[randomIndex]] = [
        shuffledBannerIds[randomIndex],
        shuffledBannerIds[index],
      ];
    }

    /*
     * Seleciona somente a quantidade desejada
     * após embaralhar todos os banners.
     */
    const selectedIds = shuffledBannerIds.slice(0, Math.max(limit, 0));

    if (selectedIds.length === 0) {
      return [];
    }

    const selectedBanners = await prisma.banner.findMany({
      where: {
        id: {
          in: selectedIds,
        },
      },

      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    /*
     * O Prisma não garante que o resultado do "in"
     * mantenha a ordem aleatória de selectedIds.
     */
    const bannersById = new Map(
      selectedBanners.map((banner) => [banner.id, banner]),
    );

    return selectedIds
      .map((id) => bannersById.get(id))
      .filter((banner): banner is NonNullable<typeof banner> =>
        Boolean(banner),
      );
  }

  async create(data: Prisma.BannerUncheckedCreateInput) {
    const banner = await prisma.banner.create({
      data,
    });
    return banner;
  }

  async listMany(): Promise<Banner[]> {
    const banners = await prisma.banner.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        store: {
          select: { id: true, name: true },
        },
      },
    });

    return banners;
  }

  async findManyByStoreId(storeId: string): Promise<Banner[]> {
    const banners = await prisma.banner.findMany({
      where: {
        storeId,
        // isActive: true,
        /* createdAt: {
          valida o banner por 30 dias
        //  gte: this.getValidBannerDate(),
        },
        */
      },
      orderBy: {
        position: "asc",
      },
    });

    return banners;
  }

  async findManyByCityId(cityId: string): Promise<Banner[]> {
    const banners = await prisma.banner.findMany({
      where: {
        store: {
          cityId,
        },
        isActive: true,
        /*o banner fica ativo por 30 dias
        createdAt: {
          gte: this.getValidBannerDate(),
        },
        */
      },
      orderBy: {
        position: "asc",
      },
    });

    return banners;
  }

  async findByIdBanner(id: string): Promise<Banner | null> {
    const banner = await prisma.banner.findUnique({
      where: {
        id,
      },
    });
    return banner;
  }

  async update(
    id: string,
    data: {
      title?: string;
      imageUrl?: string;
      isActive: boolean;
      storeId: string;
      link?: string;
    },
  ): Promise<Banner> {
    return prisma.banner.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async searchMany(query?: string, page: number = 1): Promise<Banner[]> {
    // Se o query for vazio ou não fornecido, retorna todas as categorias paginadas
    if (!query) {
      return await prisma.banner.findMany({
        skip: (page - 1) * 20,
        take: 20,
      });
    }

    // Busca as categorias com base no query
    return await prisma.banner.findMany({
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

  async delete(id: string): Promise<void> {
    try {
      await prisma.banner.delete({ where: { id } });
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
