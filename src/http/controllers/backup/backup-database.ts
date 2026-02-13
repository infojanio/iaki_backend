import { FastifyReply, FastifyRequest } from "fastify";
import { createDatabaseBackup } from "@/utils/backup";

export async function backupDatabase(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (request.user.role !== "ADMIN") {
    return reply.status(403).send({ message: "Unauthorized" });
  }

  try {
    const fileName = await createDatabaseBackup();

    return reply.status(200).send({
      message: "Backup criado com sucesso",
      file: fileName,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao gerar backup",
    });
  }
}
