/*
  Warnings:

  - A unique constraint covering the columns `[code,collegeId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collegeId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `RSVP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'SUPERADMIN';

-- DropIndex
DROP INDEX "public"."Class_code_key";

-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Class" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Note" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."RSVP" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "collegeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AllowedUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_domain_key" ON "public"."College"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedUser_email_key" ON "public"."AllowedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_collegeId_key" ON "public"."Class"("code", "collegeId");

-- AddForeignKey
ALTER TABLE "public"."AllowedUser" ADD CONSTRAINT "AllowedUser_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RSVP" ADD CONSTRAINT "RSVP_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
