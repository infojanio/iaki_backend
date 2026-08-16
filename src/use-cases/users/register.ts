import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "../../utils/messages/errors/user-already-exists-error";
import { Role, User } from "@prisma/client";
import { makeUserRegistrationConfirmationEmail } from "@/providers/mail/templates/user-registration-confirmation";
import { MailProvider } from "@/providers/mail/mail-provider";

interface RegisterUseCaseRequest {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  role: Role;
  cpf?: string;
  street: string;
  cityId: string | undefined;
  state: string | undefined;
  postalCode: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    id,
    name,
    email,
    password,
    phone,
    cpf,
    avatar,
    role,
    cityId,
    postalCode,
    state,
    street,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    try {
      const passwordHash = await hash(password, 6);

      const userWithSameEmail = await this.usersRepository.findByEmail(email);

      if (userWithSameEmail) {
        throw new UserAlreadyExistsError();
      }

      // Cria o usuário
      const user = await this.usersRepository.create({
        id,
        name,
        email,
        passwordHash,
        phone,
        cpf,
        state,
        cityId,
        postalCode,
        street,
        avatar,
        role,
      });

      //envia o email de confirmação do cadastro
      const registrationEmail = makeUserRegistrationConfirmationEmail({
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      });

      try {
        await this.mailProvider.sendMail({
          to: user.email,
          subject: registrationEmail.subject,
          text: registrationEmail.text,
          html: registrationEmail.html,
        });

        console.log(
          "[RegisterUseCase] E-mail de confirmação enviado:",
          user.email,
        );
      } catch (error) {
        console.error(
          "[RegisterUseCase] Não foi possível enviar o e-mail de confirmação:",
          error,
        );
      }

      return { user };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      throw new Error("Erro inesperado ao registrar usuário e endereço");
    }
  }
}
