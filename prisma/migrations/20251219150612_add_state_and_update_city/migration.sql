/*
  Warnings:

  - You are about to drop the column `created_at` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `cities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,state_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state_id` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cities_name_state_key";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "created_at",
DROP COLUMN "state",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "state_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_uf_key" ON "states"("uf");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_state_id_key" ON "cities"("name", "state_id");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
