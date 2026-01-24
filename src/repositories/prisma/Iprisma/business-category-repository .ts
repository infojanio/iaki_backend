import { BusinessCategory, Prisma } from "@prisma/client";

export interface BusinessCategoriesRepository {
  findById(id: string): Promise<BusinessCategory | null>;
  findByName(name: string): Promise<BusinessCategory | null>;
  findManyByCityId(cityId: string): Promise<BusinessCategory[]>;

  findMany(): Promise<BusinessCategory[]>;
  findAll(): Promise<BusinessCategory[]>;

  search(query: string): Promise<BusinessCategory[]>;

  create(data: Prisma.BusinessCategoryCreateInput): Promise<BusinessCategory>;

  update(
    id: string,
    data: {
      name?: string;
      image?: string | null;
    },
  ): Promise<BusinessCategory>;

  delete(id: string): Promise<BusinessCategory>;
}
