import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";

import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";
import { MailProvider } from "@/providers/mail/mail-provider";

import { UserNotFoundError } from "../../utils/messages/errors/user-not-found-error";

interface DeleteUserUseCaseRequest {
  userId: string;
}

interface DeleteUserUseCaseResponse {
  message: string;
}

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    // 1. Busca usuário
    const existingUser = await this.usersRepository.findById(userId);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    // 2. Protege ADMIN e SUPER_ADMIN
    if (existingUser.role !== Role.USER) {
      throw new Error("Somente contas de clientes podem ser excluídas.");
    }

    // 3. Verifica se já foi excluído
    const alreadyDeleted =
      existingUser.email.startsWith("deleted+") &&
      existingUser.email.endsWith("@deleted.iaki.local");

    if (alreadyDeleted) {
      return {
        message: "Esta conta já foi excluída.",
      };
    }

    /**
     * IMPORTANTE:
     * guardar nome e email ANTES da anonimização.
     */
    const originalName = existingUser.name;
    const originalEmail = existingUser.email;

    // 4. Gera uma senha aleatória
    const passwordHash = await hash(randomBytes(64).toString("hex"), 6);

    // 5. Novo e-mail interno anonimizado
    const deletedEmail = `deleted+${existingUser.id}@deleted.iaki.local`;

    // 6. Remove sessões/refresh tokens
    await this.usersRepository.deleteRefreshTokensByUserId(userId);

    // 7. Anonimiza usuário
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

    /**
     * 8. Envia confirmação para o e-mail ORIGINAL.
     *
     * A exclusão já aconteceu.
     * Se o SMTP falhar, NÃO desfazemos a exclusão.
     */
    try {
      await this.mailProvider.sendMail({
        to: originalEmail,

        subject: "Confirmação de exclusão de conta - Clube IAki",

        text: `
Olá, ${originalName}.

Sua conta no Clube IAki foi excluída com sucesso.

Seus dados pessoais de cadastro foram removidos e seu acesso à plataforma foi encerrado.

Alguns registros históricos poderão ser mantidos de forma anonimizada quando necessários para segurança, auditoria e integridade das operações realizadas no Clube IAki.

Caso você queira utilizar o Clube IAki novamente no futuro, poderá realizar um novo cadastro.

Atenciosamente,
Equipe Clube IAki
        `.trim(),

        html: `
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              color: #333333;
            "
          >
            <div
              style="
                background-color: #4CAF50;
                padding: 24px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              "
            >
              <h1
                style="
                  color: #ffffff;
                  margin: 0;
                  font-size: 24px;
                "
              >
                Clube IAki
              </h1>
            </div>

            <div
              style="
                padding: 30px;
                background-color: #ffffff;
                border: 1px solid #e5e7eb;
                border-top: none;
                border-radius: 0 0 10px 10px;
              "
            >
              <h2
                style="
                  margin-top: 0;
                  color: #333333;
                "
              >
                Conta excluída
              </h2>

              <p>
                Olá,
                <strong>${originalName}</strong>.
              </p>

              <p>
                Confirmamos que sua conta no
                <strong>Clube IAki</strong>
                foi excluída com sucesso.
              </p>

              <div
                style="
                  margin: 22px 0;
                  padding: 16px;
                  background-color: #f0fdf4;
                  border: 1px solid #bbf7d0;
                  border-radius: 8px;
                  color: #166534;
                "
              >
                ✅ Seus dados pessoais de cadastro
                foram removidos e seu acesso à
                plataforma foi encerrado.
              </div>

              <p
                style="
                  font-size: 14px;
                  color: #666666;
                  line-height: 1.6;
                "
              >
                Alguns registros históricos poderão
                ser mantidos de forma anonimizada
                quando necessários para segurança,
                auditoria e integridade das operações
                realizadas no Clube IAki.
              </p>

              <p
                style="
                  font-size: 14px;
                  color: #666666;
                  line-height: 1.6;
                "
              >
                Caso queira utilizar o Clube IAki
                novamente no futuro, você poderá
                realizar um novo cadastro.
              </p>

              <p
                style="
                  margin-top: 26px;
                "
              >
                Atenciosamente,<br />
                <strong>Equipe Clube IAki</strong>
              </p>
            </div>
          </div>
        `,
      });

      console.log(
        "[DeleteUserUseCase] E-mail de exclusão enviado:",
        originalEmail,
      );
    } catch (error) {
      console.error(
        "[DeleteUserUseCase] Conta excluída, mas falhou o envio do e-mail:",
        error,
      );
    }

    return {
      message:
        "Conta do cliente excluída e dados pessoais removidos com sucesso.",
    };
  }
}
