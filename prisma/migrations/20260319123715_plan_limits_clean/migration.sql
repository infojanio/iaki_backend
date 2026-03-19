/*
  Warnings:

  - The values [PAST_DUE] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `storeId` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `end_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `renewed_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `store_id` to the `banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `reels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('ACTIVE', 'TRIALING', 'EXPIRED', 'CANCELED');
ALTER TABLE "subscriptions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_storeId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- AlterTable
ALTER TABLE "banners" DROP COLUMN "storeId",
ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "end_at",
DROP COLUMN "renewed_at",
DROP COLUMN "start_at",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_trial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Plan";

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "max_products" INTEGER,
    "max_banners" INTEGER,
    "max_reels" INTEGER,
    "max_categories" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");

-- CreateIndex
CREATE INDEX "banners_store_id_idx" ON "banners"("store_id");

-- CreateIndex
CREATE INDEX "products_store_id_idx" ON "products"("store_id");

-- CreateIndex
CREATE INDEX "reels_store_id_idx" ON "reels"("store_id");

-- CreateIndex
CREATE INDEX "subscriptions_store_id_status_idx" ON "subscriptions"("store_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions"("plan_id");

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
