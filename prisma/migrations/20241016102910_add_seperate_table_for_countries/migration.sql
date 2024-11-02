/*
  Warnings:

  - You are about to drop the column `country` on the `Coffee` table. All the data in the column will be lost.
  - Added the required column `countryName` to the `Coffee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coffee" DROP COLUMN "country",
ADD COLUMN     "countryName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Country" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "Coffee" ADD CONSTRAINT "Coffee_countryName_fkey" FOREIGN KEY ("countryName") REFERENCES "Country"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
