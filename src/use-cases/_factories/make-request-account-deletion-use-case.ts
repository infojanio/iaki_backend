import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";

import { RequestAccountDeletionUseCase } from "../users/request-account-deletion";

export function makeRequestAccountDeletionUseCase() {
  const mailProvider = new NodemailerMailProvider();

  return new RequestAccountDeletionUseCase(mailProvider);
}
