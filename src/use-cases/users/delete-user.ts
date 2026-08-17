import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";

import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";
import { UserNotFoundError } from "../../utils/messages/errors/user-not-found-error";

interface DeleteUserUseCaseRequest {
  userId: string;
}

interface DeleteUserUseCaseResponse {
  message: string;
}

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    // Verifica se o usuário existe
    const existingUser = await this.usersRepository.findById(userId);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    // Protege contas administrativas
    if (existingUser.role !== Role.USER) {
      throw new Error("Somente contas de clientes podem ser excluídas.");
    }

    /**
     * Gera uma senha aleatória que ninguém conhece.
     * O valor original nunca é armazenado.
     */
    const passwordHash = await hash(randomBytes(64).toString("hex"), 6);

    /**
     * Substitui o e-mail original por um endereço
     * interno único.
     *
     * Isso libera o e-mail real caso o usuário queira
     * realizar um novo cadastro futuramente.
     */
    const deletedEmail = `deleted+${existingUser.id}@deleted.iaki.local`;

    /**
     * Anonimiza somente os dados pessoais.
     *
     * Permanecem automaticamente:
     * - id
     * - storeId
     * - cityId
     * - role
     * - createdAt
     *
     * porque não são enviados no update.
     */
    await this.usersRepository.update(userId, {
      name: "Usuário excluído",

      email: deletedEmail,

      passwordHash,

      phone: null,

      cpf: null,

      avatar: null,

      street: null,

      state: null,

      postalCode: null,
    });

    return {
      message:
        "Conta do cliente excluída e dados pessoais removidos com sucesso.",
    };
  }
}
