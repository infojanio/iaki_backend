/*
  Warnings:

  - The values [ABANDONED] on the enum `CartStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CartStatus_new" AS ENUM ('OPEN', 'CHECKED_OUT', 'CLOSED');
ALTER TABLE "carts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "carts" ALTER COLUMN "status" TYPE "CartStatus_new" USING ("status"::text::"CartStatus_new");
ALTER TYPE "CartStatus" RENAME TO "CartStatus_old";
ALTER TYPE "CartStatus_new" RENAME TO "CartStatus";
DROP TYPE "CartStatus_old";
ALTER TABLE "carts" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropIndex
DROP INDEX "carts_user_id_store_id_status_key";
