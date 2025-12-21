import { State, Prisma } from "@prisma/client";

export interface StatesRepository {
  findById(id: string): Promise<State | null>;
  findByUf(uf: string): Promise<State | null>;
  findByName(name: string): Promise<State | null>;

  findMany(): Promise<State[]>;

  create(data: Prisma.StateUncheckedCreateInput): Promise<State>;

  update(
    id: string,
    data: {
      name?: string;
      uf?: string;
    },
  ): Promise<State>;

  delete(id: string): Promise<State>;
}
