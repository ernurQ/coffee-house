-- CreateTable
CREATE TABLE "cofees_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cofees_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_coffee_to_coffees_list" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_coffee_to_coffees_list_AB_unique" ON "_coffee_to_coffees_list"("A", "B");

-- CreateIndex
CREATE INDEX "_coffee_to_coffees_list_B_index" ON "_coffee_to_coffees_list"("B");

-- AddForeignKey
ALTER TABLE "_coffee_to_coffees_list" ADD CONSTRAINT "_coffee_to_coffees_list_A_fkey" FOREIGN KEY ("A") REFERENCES "Coffee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_coffee_to_coffees_list" ADD CONSTRAINT "_coffee_to_coffees_list_B_fkey" FOREIGN KEY ("B") REFERENCES "cofees_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
