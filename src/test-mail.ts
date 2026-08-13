import "dotenv/config";

import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";

async function main() {
  console.log("🔎 Testando conexão SMTP...");

  const mailProvider = new NodemailerMailProvider();

  try {
    await mailProvider.verifyConnection();

    console.log("✅ SMTP conectado com sucesso.");
  } catch (error) {
    console.error("❌ Falha na conexão SMTP:");
    console.error(error);

    return;
  }

  try {
    console.log("📧 Enviando e-mail de teste...");

    await mailProvider.sendMail({
      to: "contato@iaki.com.br",

      subject: "Teste de e-mail - Clube IAki",

      text: `
O envio de e-mails do Clube IAki está funcionando.

Configuração SMTP concluída com sucesso.
      `.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 520px;
            margin: 0 auto;
            padding: 24px;
          "
        >
          <h2
            style="
              color: #6d28d9;
              margin-bottom: 20px;
            "
          >
            Clube IAki
          </h2>

          <p
            style="
              color: #333333;
              font-size: 16px;
              line-height: 1.5;
            "
          >
            O envio de e-mails do Clube IAki está funcionando.
          </p>

          <p
            style="
              color: #16a34a;
              font-size: 16px;
              font-weight: bold;
            "
          >
            ✅ Configuração SMTP concluída com sucesso.
          </p>
        </div>
      `,
    });

    console.log("✅ E-mail de teste enviado com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:");
    console.error(error);

    throw error;
  }
}

main().catch((error) => {
  console.error("❌ Erro inesperado no teste de SMTP:");
  console.error(error);

  process.exit(1);
});
