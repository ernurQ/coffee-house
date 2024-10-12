/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `cofees_list` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cofees_list_name_key" ON "cofees_list"("name");
