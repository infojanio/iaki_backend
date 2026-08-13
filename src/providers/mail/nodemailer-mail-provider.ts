import nodemailer, { Transporter } from "nodemailer";

import { MailProvider, SendMailParams } from "./mail-provider";

export class NodemailerMailProvider implements MailProvider {
  private transporter: Transporter;

  private readonly fromAddress: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const fromAddress = process.env.SMTP_FROM;

    if (!host) {
      throw new Error("SMTP_HOST não configurado.");
    }

    if (!port) {
      throw new Error("SMTP_PORT não configurado.");
    }

    if (!user) {
      throw new Error("SMTP_USER não configurado.");
    }

    if (!password) {
      throw new Error("SMTP_PASSWORD não configurado.");
    }

    if (!fromAddress) {
      throw new Error("SMTP_FROM não configurado.");
    }

    this.fromAddress = fromAddress;

    const secure = process.env.SMTP_SECURE === "true";

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,

      auth: {
        user,
        pass: password,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,

      disableFileAccess: true,
      disableUrlAccess: true,
    });
  }

  async sendMail({ to, subject, html, text }: SendMailParams): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: {
          name: "Clube IAki",
          address: this.fromAddress,
        },

        to,
        subject,
        html,
        text,

        // Garante que o envelope SMTP utilize
        // exatamente a conta autenticada.
        envelope: {
          from: this.fromAddress,
          to,
        },
      });

      console.log("[MailProvider] E-mail enviado:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      });
    } catch (error) {
      console.error("[MailProvider] Erro ao enviar e-mail:", error);

      throw new Error("Não foi possível enviar o e-mail.");
    }
  }

  async verifyConnection(): Promise<void> {
    await this.transporter.verify();
  }
}
