import { prisma } from "@/lib/prisma";
import { Prisma, PrismaClient, User } from "@prisma/client";
import {
  FindManyUsersParams,
  FindManyUsersResponse,
  UserProfileDB,
  UsersRepository,
} from "./Iprisma/users-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

// Select "seguro" para profile (sem passwordHash)
const userProfileSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  phone: true,
  cpf: true,
  role: true,
  avatar: true,
  street: true,
  city: true,
  store: true,
  state: true,
  postalCode: true,
  createdAt: true,
});

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async findProfileById(userId: string): Promise<UserProfileDB | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    }) as any;
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        avatar: true,
        role: true,
        passwordHash: true,

        storeId: true,

        // 👇 Nome da loja
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            isActive: true,
          },
        },

        cityId: true,
        street: true,
        state: true,
        postalCode: true,
        createdAt: true,

        city: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * 🔐 USADO NA AUTENTICAÇÃO
   * PRECISA trazer storeId
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        avatar: true,
        storeId: true,

        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true,
            isActive: true,
          },
        },
      },
    });
  }

  async balanceByUserId(userId: string): Promise<number> {
    const validatedCashbacks = await prisma.cashback.findMany({
      where: { userId: userId, order: { validatedAt: { not: null } } },
      select: { amount: true },
    });

    return validatedCashbacks
      .reduce((acc, cashback) => acc.plus(cashback.amount), new Decimal(0))
      .toNumber();
  }

  async updateCity(userId: string, cityId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { cityId },
    });
  }

  async update(
    userId: string,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch {
      throw new ResourceNotFoundError();
    }
  }

  //atualizar a senha
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        passwordHash,
      },
    });
  }

  //transformar USUÁRIO em ADMIN
  async attachStore(userId: string, storeId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        storeId,
        role: "ADMIN",
      },
    });
  }

  //listar usuários
  async findManyUsers({
    page,
    query,
  }: FindManyUsersParams): Promise<FindManyUsersResponse> {
    const where = query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          city: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (page - 1) * 10,
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }
}
