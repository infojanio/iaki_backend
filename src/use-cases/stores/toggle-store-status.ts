import { prisma } from "@/lib/prisma";

export class ToggleStoreStatusUseCase {
  async execute(id: string, newStatus: boolean) {
    return await prisma.store.update({
      where: { id },
      data: { isActive: newStatus },
    });
  }
}
