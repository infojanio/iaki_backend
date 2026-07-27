import { Reel, Prisma } from "@prisma/client";
export interface ReelsRepository {
  findById(id: string): Promise<Reel | null>;
  findByIdReel(id: string): Promise<Reel | null>;
  findPremiumByCity(cityId: string, limit?: number): Promise<Reel[]>;
  create(data: Prisma.ReelUncheckedCreateInput): Promise<Reel>;
  listMany(): Promise<Reel[]>; //listar todas
  findManyByStoreId(storeId: string): Promise<Reel[]>;
  searchMany(search: string, page: number): Promise<Reel[]>; //buscar por nome
  update(
    id: string,
    data: {
      title?: string;
      imageUrl?: string;
      link?: string;
    },
  ): Promise<Reel>;
  delete(id: string): Promise<void>;
}
