import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function createDatabaseBackup() {
  const backupDir = path.resolve(__dirname, "../../backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const fileName = `backup-${Date.now()}.dump`;
  const filePath = path.join(backupDir, fileName);

  const command = `
    pg_dump 
    --dbname=${process.env.DATABASE_URL} 
    -F c 
    -f ${filePath}
  `;

  await execAsync(command);

  return fileName;
}
