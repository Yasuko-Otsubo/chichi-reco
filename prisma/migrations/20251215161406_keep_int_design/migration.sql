/*
  Warnings:

  - A unique constraint covering the columns `[profileId,date]` on the table `Records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Records_profileId_date_key" ON "Records"("profileId", "date");
