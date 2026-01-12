/*
  Warnings:

  - You are about to drop the column `storeId` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_storeId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "storeId";
