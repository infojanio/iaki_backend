import { City, Prisma } from "@prisma/client";

export interface CitiesRepository {
  findById(id: string): Promise<City | null>;
  findByName(name: string): Promise<City | null>;

  findMany(): Promise<City[]>; // listar todas
  findManyActive(): Promise<City[]>; // listar cidades com lojas ativas (opcional)
  findByStateId(stateId: string): Promise<City[]>;

  search(query: string): Promise<City[]>; // buscar por nome ou estado

  create(data: Prisma.CityUncheckedCreateInput): Promise<City>;

  update(
    id: string,
    data: {
      name?: string;
      state?: string;
    },
  ): Promise<City>;

  delete(id: string): Promise<City>;
}
