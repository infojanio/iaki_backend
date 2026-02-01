import { Prisma, Role, User } from "@prisma/client";
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
  created_at: Date;
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
  avatar: string | null;
};

export interface UsersRepository {
  /**
   * Perfil público
   */
  findProfileById(userId: string): Promise<UserProfileDB | null>;

  /**
   * Busca completa (uso interno / admin)
   */
  findById(id: string): Promise<User | null>;

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

  /**
   * Atualiza cidade
   */
  updateCity(userId: string, cityId: string): Promise<User>;

  /**
   * Saldo de cashback
   */
  balanceByUserId(userId: string): Promise<number>;
}
