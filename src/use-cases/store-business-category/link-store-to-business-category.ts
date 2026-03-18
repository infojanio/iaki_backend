import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";
import { Prisma } from "@prisma/client";

export class LinkStoreToBusinessCategoryUseCase {
  constructor(private repository: StoreBusinessCategoryRepository) {}

  async execute({ storeId, categoryId }: any) {
    try {
      await this.repository.create({ storeId, categoryId });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error("Essa loja já está vinculada a essa categoria.");
      }
      throw err;
    }
  }
}
