import { MailProvider } from "@/providers/mail/mail-provider";

interface RequestAccountDeletionUseCaseRequest {
  name: string;
  email: string;
  reason?: string;
}

export class RequestAccountDeletionUseCase {
  constructor(private mailProvider: MailProvider) {}

  async execute({ name, email, reason }: RequestAccountDeletionUseCaseRequest) {
    const requestDate = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    await this.mailProvider.sendMail({
      to: "contato@iaki.com.br",

      subject: "Solicitação de exclusão de conta - Clube IAki",

      text: `
Nova solicitação de exclusão de conta.

Nome:
${name}

E-mail cadastrado:
${email}

Motivo:
${reason || "Não informado"}

Data da solicitação:
${requestDate}

Acesse o painel administrativo do Clube IAki para localizar o cliente e processar a exclusão.
      `.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
          "
        >
          <h2>
            Solicitação de exclusão de conta
          </h2>

          <p>
            Uma nova solicitação foi recebida
            pelo site do Clube IAki.
          </p>

          <div
            style="
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            "
          >
            <p>
              <strong>Nome:</strong>
              ${name}
            </p>

            <p>
              <strong>E-mail:</strong>
              ${email}
            </p>

            <p>
              <strong>Motivo:</strong>
              ${reason || "Não informado"}
            </p>

            <p>
              <strong>Data:</strong>
              ${requestDate}
            </p>
          </div>

          <p
            style="
              margin-top: 20px;
            "
          >
            Acesse o painel administrativo
            do Clube IAki para localizar o
            cliente e processar a exclusão.
          </p>
        </div>
      `,
    });

    return {
      message: "Solicitação enviada.",
    };
  }
}
