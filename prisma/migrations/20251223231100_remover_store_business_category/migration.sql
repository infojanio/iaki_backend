/*
  Warnings:

  - You are about to drop the `store_business_categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,cityId]` on the table `business_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityId` to the `business_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "store_business_categories" DROP CONSTRAINT "store_business_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "store_business_categories" DROP CONSTRAINT "store_business_categories_store_id_fkey";

-- AlterTable
ALTER TABLE "business_categories" ADD COLUMN     "cityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "category_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "store_business_categories";

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_name_cityId_key" ON "business_categories"("name", "cityId");

-- AddForeignKey
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "business_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
