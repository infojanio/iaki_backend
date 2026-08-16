type UserRegistrationConfirmationParams = {
  name: string;
  email: string;
  phone?: string | null;
  createdAt?: Date;
};

function escapeHtml(value: string) {
  return value
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace('"', "&quot;")
    .replace("'", "&#039;");
}

export function makeUserRegistrationConfirmationEmail({
  name,
  email,
  phone,
  createdAt = new Date(),
}: UserRegistrationConfirmationParams) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "Não informado";

  const registrationDate = createdAt.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  });

  const subject = "Cadastro realizado com sucesso - Clube IAki";

  const text = `
Olá, ${name}!

Seu cadastro no Clube IAki foi realizado com sucesso.

Dados cadastrados:

Nome: ${name}
E-mail: ${email}
Telefone: ${phone || "Não informado"}
Data do cadastro: ${registrationDate}

Agora você já pode acessar o Clube IAki utilizando seu e-mail e sua senha.

Por segurança, nunca compartilhe sua senha ou códigos de recuperação.

Clube IAki
  `.trim();

  const html = `
    <!DOCTYPE html>

    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          Cadastro realizado - Clube IAki
        </title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            background-color: #f4f4f5;
            padding: 30px 15px;
          "
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >

                <!-- Cabeçalho -->
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #4CAF50;
                      padding: 28px 20px;
                    "
                  >
                    <div
                      style="
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: bold;
                      "
                    >
                      Clube IAki
                    </div>

                    <div
                      style="
                        margin-top: 6px;
                        color: #e8f5e9;
                        font-size: 14px;
                      "
                    >
                      Clube de vantagens
                    </div>
                  </td>
                </tr>

                <!-- Conteúdo -->
                <tr>
                  <td
                    style="
                      padding: 32px 28px;
                    "
                  >
                    <h2
                      style="
                        margin: 0;
                        color: #333333;
                        font-size: 23px;
                      "
                    >
                      Cadastro realizado! 🎉
                    </h2>

                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        margin-top: 20px;
                      "
                    >
                      Olá,
                      <strong>${safeName}</strong>!
                    </p>

                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Seu cadastro no
                      <strong>Clube IAki</strong>
                      foi realizado com sucesso.
                    </p>

                    <p
                      style="
                        font-size: 15px;
                        color: #666666;
                        line-height: 1.6;
                      "
                    >
                      Confira abaixo as informações
                      associadas à sua conta:
                    </p>

                    <!-- Dados -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="
                        margin-top: 22px;
                        background-color: #f8fafc;
                        border-radius: 8px;
                        padding: 5px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            color: #666666;
                            font-size: 14px;
                          "
                        >
                          Nome
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            font-weight: bold;
                            font-size: 14px;
                          "
                        >
                          ${safeName}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            color: #666666;
                            font-size: 14px;
                          "
                        >
                          E-mail
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            font-weight: bold;
                            font-size: 14px;
                          "
                        >
                          ${safeEmail}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            color: #666666;
                            font-size: 14px;
                          "
                        >
                          Telefone
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 13px 15px;
                            border-bottom: 1px solid #e5e7eb;
                            font-weight: bold;
                            font-size: 14px;
                          "
                        >
                          ${safePhone}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 13px 15px;
                            color: #666666;
                            font-size: 14px;
                          "
                        >
                          Data do cadastro
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 13px 15px;
                            font-weight: bold;
                            font-size: 14px;
                          "
                        >
                          ${registrationDate}
                        </td>
                      </tr>
                    </table>

                    <div
                      style="
                        margin-top: 26px;
                        padding: 16px;
                        border-radius: 8px;
                        background-color: #f0fdf4;
                        border: 1px solid #bbf7d0;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #166534;
                          font-size: 14px;
                          line-height: 1.5;
                        "
                      >
                        ✅ Sua conta já está pronta para uso.
                        Você pode entrar no Clube IAki
                        utilizando seu e-mail e a senha
                        cadastrada.
                      </p>
                    </div>

                    <div
                      style="
                        margin-top: 20px;
                        padding: 16px;
                        border-radius: 8px;
                        background-color: #fff7ed;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #9a3412;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        🔒 Por segurança, nunca compartilhe
                        sua senha ou códigos de recuperação
                        recebidos por e-mail.
                      </p>
                    </div>

                  </td>
                </tr>

                <!-- Rodapé -->
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 22px;
                      background-color: #f8fafc;
                      color: #888888;
                      font-size: 12px;
                      line-height: 1.5;
                    "
                  >
                    Este é um e-mail automático enviado pelo
                    Clube IAki.

                    <br />

                    Não é necessário responder esta mensagem.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return {
    subject,
    text,
    html,
  };
}
