export interface SendMailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailProvider {
  sendMail(data: SendMailParams): Promise<void>;
}
