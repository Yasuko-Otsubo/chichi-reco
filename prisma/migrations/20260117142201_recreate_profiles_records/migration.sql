/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Records" DROP CONSTRAINT "Records_profileId_fkey";

-- DropTable
DROP TABLE "public"."Contact";

-- DropTable
DROP TABLE "public"."Profiles";

-- DropTable
DROP TABLE "public"."Records";

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "supabase_user_id" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "target_weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "steps" INTEGER NOT NULL,
    "memo" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_supabase_user_id_key" ON "profiles"("supabase_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "records_profileId_date_key" ON "records"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "contact_email_key" ON "contact"("email");

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
