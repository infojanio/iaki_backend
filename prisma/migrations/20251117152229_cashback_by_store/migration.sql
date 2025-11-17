/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `cashback_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `cashbacks` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `orders` table. All the data in the column will be lost.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tenant_id` on the `payment_types` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `reels` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `stores` table. All the data in the column will be lost.
  - The `role` column on the `stores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tenant_id` on the `subcategories` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_id` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `store_id` to the `cashback_transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `cashbacks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roles" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING', 'VALIDATED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_planId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "cashback_transactions" DROP CONSTRAINT "cashback_transactions_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "cashbacks" DROP CONSTRAINT "cashbacks_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_types" DROP CONSTRAINT "payment_types_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "reels" DROP CONSTRAINT "reels_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenant_id_fkey";

-- DropIndex
DROP INDEX "carts_tenant_id_idx";

-- DropIndex
DROP INDEX "cashback_transactions_tenant_id_idx";

-- DropIndex
DROP INDEX "cashbacks_tenant_id_idx";

-- DropIndex
DROP INDEX "orders_tenant_id_idx";

-- DropIndex
DROP INDEX "payment_types_tenant_id_type_key";

-- DropIndex
DROP INDEX "products_tenant_id_idx";

-- DropIndex
DROP INDEX "stores_tenant_id_slug_key";

-- DropIndex
DROP INDEX "users_tenant_id_email_key";

-- DropIndex
DROP INDEX "users_tenant_id_idx";

-- AlterTable
ALTER TABLE "banners" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "cashback_transactions" DROP COLUMN "tenant_id",
ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cashbacks" DROP COLUMN "tenant_id",
ADD COLUMN     "store_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tenant_id",
DROP COLUMN "status",
ADD COLUMN     "status" "order_status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payment_types" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "reels" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "tenant_id",
DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "subcategories" DROP COLUMN "tenant_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "tenant_id",
DROP COLUMN "role",
ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Tenant";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "TenantStatus";

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL,
    "renewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_business_categories" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "store_business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_business_categories_store_id_category_id_key" ON "store_business_categories"("store_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_business_categories" ADD CONSTRAINT "store_business_categories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_business_categories" ADD CONSTRAINT "store_business_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "business_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbacks" ADD CONSTRAINT "cashbacks_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashback_transactions" ADD CONSTRAINT "cashback_transactions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
