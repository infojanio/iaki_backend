import { Prisma, Role, Store, User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Endereço simples (User possui campos diretos, não array)
 */
export type AddressDTO = {
  street: string | null;
  cityId: string | null;
  state: string | null;
  postalCode: string | null;
};

/**
 * Perfil público do usuário (SEM dados sensíveis)
 */
export type UserProfileDB = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatar: string | null;
  createdAt: Date;
  address: AddressDTO;
};

/**
 * Retorno específico para autenticação
 * 🔐 ESSENCIAL para JWT e regras de segurança
 */
export type AuthUserDB = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  storeId: string | null;
  store: {
    id: string;
    name: string;
    slug: string | null;
    avatar: string | null;
    isActive: boolean;
  } | null;
  avatar: string | null;
};

export interface FindManyUsersParams {
  page: number;
  query?: string;
}

export interface FindManyUsersResponse {
  users: User[];
  total: number;
}

export interface UsersRepository {
  /**
   * Perfil público
   */
  findProfileById(userId: string): Promise<UserProfileDB | null>;

  /**
   * Busca completa (uso interno / admin)
   */
  findById(id: string): Promise<User | null>;

  findManyUsers(params: FindManyUsersParams): Promise<FindManyUsersResponse>;

  /**
   * 🔐 AUTENTICAÇÃO
   * Deve retornar storeId para regras de autorização
   */
  findByEmail(email: string): Promise<AuthUserDB | null>;

  /**
   * Criação
   */
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;

  /**
   * Atualização genérica
   */
  update(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>;

  //atualização de senha
  updatePassword(userId: string, passwordHash: string): Promise<void>;

  /**
   * Atualiza cidade
   */
  updateCity(userId: string, cityId: string): Promise<User>;

  /**
   * Saldo de cashback
   */
  balanceByUserId(userId: string): Promise<number>;

  //criar usuário ADMIN e vincular a loja
  attachStore(userId: string, storeId: string): Promise<void>;
}
