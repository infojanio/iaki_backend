import { Banner, Prisma } from "@prisma/client";
export interface BannersRepository {
  findById(id: string): Promise<Banner | null>;
  findByIdBanner(id: string): Promise<Banner | null>;
  findManyByStoreId(storeId: string): Promise<Banner[]>;
  findManyByCityId(cityId: string): Promise<Banner[]>;
  create(data: Prisma.BannerUncheckedCreateInput): Promise<Banner>;
  listMany(): Promise<Banner[]>; //listar todas
  searchMany(search: string, page: number): Promise<Banner[]>; //buscar por nome
  update(
    id: string,
    data: {
      title?: string;
      imageUrl?: string;
      isActive: boolean;
      storeId: string;
      link?: string;
    },
  ): Promise<Banner>;
  delete(id: string): Promise<void>;
}
