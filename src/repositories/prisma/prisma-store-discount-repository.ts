import { prisma } from "@/lib/prisma";
import { StoreDiscount, Prisma } from "@prisma/client";
import { StoreDiscountRepository } from "./Iprisma/store-discount-repository";

export class PrismaStoreDiscountRepository implements StoreDiscountRepository {
  async findById(id: string): Promise<StoreDiscount | null> {
    return prisma.storeDiscount.findUnique({ where: { id } });
  }

  async findActiveByStoreId(storeId: string): Promise<StoreDiscount | null> {
    const now = new Date();

    return prisma.storeDiscount.findFirst({
      where: {
        storeId,
        isActive: true,
        OR: [
          { validFrom: null, validTo: null },
          { validFrom: { lte: now }, validTo: { gte: now } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findManyByStoreId(storeId: string): Promise<StoreDiscount[]> {
    return prisma.storeDiscount.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async deactivateByStoreId(storeId: string): Promise<void> {
    await prisma.storeDiscount.updateMany({
      where: { storeId, isActive: true },
      data: { isActive: false },
    });
  }

  async create(
    data: Prisma.StoreDiscountUncheckedCreateInput,
  ): Promise<StoreDiscount> {
    return prisma.storeDiscount.create({ data });
  }

  async update(
    id: string,
    data: Prisma.StoreDiscountUncheckedUpdateInput,
  ): Promise<StoreDiscount> {
    return prisma.storeDiscount.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.storeDiscount.delete({ where: { id } });
  }
}
