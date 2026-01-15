/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,store_id,status]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cashback_snapshot` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_snapshot` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('OPEN', 'CHECKED_OUT', 'ABANDONED');

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "cashback_snapshot" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "price_snapshot" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "carts" ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "store_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_product_id_key" ON "cart_items"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_store_id_status_key" ON "carts"("user_id", "store_id", "status");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
