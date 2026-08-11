import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";

async function main() {
  const mailProvider = new NodemailerMailProvider();

  const connected = await mailProvider.verifyConnection();

  console.log("SMTP conectado:", connected);

  if (!connected) {
    return;
  }

  await mailProvider.sendMail({
    to: "grejannflorencio@gmail.com",

    subject: "Teste de e-mail - Clube IAki",

    text: "O envio de e-mails do Clube IAki está funcionando.",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 520px;
          margin: auto;
        "
      >
        <h2
          style="
            color: #6d28d9;
          "
        >
          Clube IAki
        </h2>

        <p>
          O envio de e-mails do
          Clube IAki está funcionando.
        </p>

        <p>
          ✅ Configuração SMTP concluída.
        </p>
      </div>
    `,
  });

  console.log("E-mail de teste enviado.");
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
