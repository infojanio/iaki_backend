import "dotenv/config";
import nodemailer, { Transporter } from "nodemailer";

import { MailProvider, SendMailParams } from "./mail-provider";

export class NodemailerMailProvider implements MailProvider {
  private transporter: Transporter;

  constructor() {
    const host = process.env.SMTP_HOST;

    const port = Number(process.env.SMTP_PORT);

    const user = process.env.SMTP_USER;

    const password = process.env.SMTP_PASSWORD;

    if (!host) {
      throw new Error("SMTP_HOST não configurado.");
    }

    if (!port || Number.isNaN(port)) {
      throw new Error("SMTP_PORT não configurado ou inválido.");
    }

    if (!user) {
      throw new Error("SMTP_USER não configurado.");
    }

    if (!password) {
      throw new Error("SMTP_PASSWORD não configurado.");
    }

    /*
     * Porta 465 normalmente utiliza
     * TLS desde o início da conexão.
     *
     * Porta 587 normalmente inicia
     * sem TLS e utiliza STARTTLS.
     */
    const secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

    this.transporter = nodemailer.createTransport({
      host,

      port,

      secure,

      auth: {
        user,
        pass: password,
      },

      /*
       * Evita que conteúdos de e-mail
       * consigam acessar arquivos locais
       * ou URLs externas automaticamente.
       */
      disableFileAccess: true,
      disableUrlAccess: true,

      /*
       * Timeouts importantes para não
       * deixar uma requisição presa caso
       * o servidor SMTP esteja fora.
       */
      connectionTimeout: 15_000,

      greetingTimeout: 15_000,

      socketTimeout: 30_000,
    });
  }

  async sendMail({ to, subject, html, text }: SendMailParams): Promise<void> {
    const from = process.env.SMTP_FROM;

    if (!from) {
      throw new Error("SMTP_FROM não configurado.");
    }

    try {
      const info = await this.transporter.sendMail({
        from,

        to,

        subject,

        html,

        /*
         * Se não vier texto simples,
         * deixamos undefined.
         */
        text: text || undefined,
      });

      /*
       * Em desenvolvimento é útil.
       * Não exponha conteúdo do e-mail
       * nem dados sensíveis nos logs.
       */
      if (process.env.NODE_ENV !== "production") {
        console.log("[MailProvider] E-mail enviado:", {
          messageId: info.messageId,

          accepted: info.accepted,

          rejected: info.rejected,
        });
      }
    } catch (error) {
      console.error("[MailProvider] Erro ao enviar e-mail:", error);

      throw new Error("Não foi possível enviar o e-mail.");
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();

      return true;
    } catch (error) {
      console.error("[MailProvider] Falha na conexão SMTP:", error);

      return false;
    }
  }
}
