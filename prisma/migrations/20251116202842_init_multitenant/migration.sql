/*
  Warnings:

  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `stores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tenant_id,type]` on the table `payment_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id,slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenant_id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `cashback_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `cashbacks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `payment_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `reels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `subcategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'VALIDATED', 'EXPIRED');

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "planId" TEXT NOT NULL,
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "planId" TEXT,
ADD COLUMN     "status" "TenantStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cashback_transactions" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cashbacks" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tenant_id" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payment_types" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "tenant_id" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tenant_id" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "order_status";

-- DropEnum
DROP TYPE "roles";

-- CreateIndex
CREATE INDEX "carts_tenant_id_idx" ON "carts"("tenant_id");

-- CreateIndex
CREATE INDEX "cashback_transactions_tenant_id_idx" ON "cashback_transactions"("tenant_id");

-- CreateIndex
CREATE INDEX "cashbacks_tenant_id_idx" ON "cashbacks"("tenant_id");

-- CreateIndex
CREATE INDEX "orders_tenant_id_idx" ON "orders"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_types_tenant_id_type_key" ON "payment_types"("tenant_id", "type");

-- CreateIndex
CREATE INDEX "products_tenant_id_idx" ON "products"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_tenant_id_slug_key" ON "stores"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "users"("tenant_id", "email");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
